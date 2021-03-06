/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {
  ClangCompilationDatabase,
  ClangFlags,
  ClangCompilationDatabaseEntry,
  ClangRequestSettings,
} from './rpc-types';

import invariant from 'assert';
import nuclideUri from 'nuclide-commons/nuclideUri';
import {shellParse} from 'nuclide-commons/string';
import {Observable} from 'rxjs';
import {trackTiming} from '../../nuclide-analytics';
import {Cache} from '../../commons-node/cache';
import fsPromise from 'nuclide-commons/fsPromise';
import {getLogger} from 'log4js';
import {mapPathsInFlags} from './clang-flags-parser';
import {
  isHeaderFile,
  isSourceFile,
  findIncludingSourceFile,
  commonPrefix,
  guessBuildFile,
} from './utils';

const logger = getLogger('nuclide-clang-rpc');

const COMPILATION_DATABASE_FILE = 'compile_commands.json';
const PROJECT_CLANG_FLAGS_FILE = '.nuclide_clang_config.json';

const INCLUDE_SEARCH_TIMEOUT = 15000;

type ClangProjectFlags = {
  extraCompilerFlags: Array<string>,
  ignoredCompilerFlags: Array<string>,
};

let _customFlags;
function getCustomFlags() {
  if (_customFlags !== undefined) {
    return _customFlags;
  }
  try {
    // $FlowFB
    _customFlags = require('./fb/custom-flags');
  } catch (e) {
    _customFlags = null;
  }
  return _customFlags;
}

function overrideIncludePath(src: string): string {
  const customFlags = getCustomFlags();
  if (customFlags != null) {
    return customFlags.overrideIncludePath(src);
  }
  return src;
}

function getCacheKeyForDb(
  compilationDatabase: ?ClangCompilationDatabase,
): ?string {
  // only requestSettings.compilationDatabase.file is meaningful
  return compilationDatabase == null ? null : compilationDatabase.file;
}

export default class ClangFlagsManager {
  _compilationDatabases: Cache<
    ClangCompilationDatabase,
    Promise<Map<string, ClangFlags>>,
  > = new Cache({
    keyFactory: db => getCacheKeyForDb(db),
  });
  _realpathCache: Object;
  _pathToFlags: Cache<
    [string, ClangRequestSettings],
    Promise<?ClangFlags>,
  > = new Cache({
    keyFactory: ([src, requestSettings]) =>
      JSON.stringify([
        src,
        getCacheKeyForDb(requestSettings.compilationDatabase),
      ]),
  });
  _clangProjectFlags: Map<string, Promise<?ClangProjectFlags>>;

  constructor() {
    this._realpathCache = {};
    this._clangProjectFlags = new Map();
  }

  reset() {
    this._pathToFlags.clear();
    this._compilationDatabases.clear();
    this._realpathCache = {};
    this._clangProjectFlags.clear();
  }

  /**
   * @return a space-delimited string of flags or null if nothing is known
   *     about the src file. For example, null will be returned if src is not
   *     under the project root.
   */
  async getFlagsForSrc(
    src: string,
    requestSettings: ClangRequestSettings,
  ): Promise<?ClangFlags> {
    const data = await this._getFlagsForSrcCached(src, requestSettings);
    if (data == null) {
      return null;
    }
    if (data.flags === undefined) {
      const {rawData} = data;
      if (rawData == null) {
        data.flags = null;
      } else {
        const flags = await this._getModifiedFlags(src, rawData);
        data.flags = ClangFlagsManager.sanitizeCommand(
          rawData.file,
          flags,
          rawData.directory,
        );
      }
    }
    return data;
  }

  _getFlagsForSrcCached(
    src: string,
    requestSettings: ClangRequestSettings,
  ): Promise<?ClangFlags> {
    return this._pathToFlags.getOrCreate([src, requestSettings], () =>
      this._getFlagsForSrcImpl(src, requestSettings),
    );
  }

  _getFlagsForSrcImpl(
    src: string,
    requestSettings: ClangRequestSettings,
  ): Promise<?ClangFlags> {
    return trackTiming('nuclide-clang.get-flags', () =>
      this.__getFlagsForSrcImpl(src, requestSettings),
    );
  }

  _findSourceFileForHeaderFromCompilationDatabase(
    header: string,
    dbFlags: Map<string, ClangFlags>,
  ): ?string {
    const basename = ClangFlagsManager._getFileBasename(header);
    const srcWithSameBasename = [];
    const otherSrcs = [];
    for (const path of dbFlags.keys()) {
      if (
        ClangFlagsManager._getFileBasename(path) === basename &&
        isSourceFile(path)
      ) {
        srcWithSameBasename.push({
          score: commonPrefix(path, header),
          path,
        });
      } else {
        otherSrcs.push({
          score: commonPrefix(path, header),
          path,
        });
      }
    }
    const sortSrcs = srcs => srcs.sort((a, b) => b.score - a.score); // prefer bigger matches
    if (srcWithSameBasename.length > 0) {
      return sortSrcs(srcWithSameBasename)[0].path;
    }
    if (otherSrcs.length > 0) {
      return sortSrcs(otherSrcs)[0].path;
    }
    return null;
  }

  _getXFlagForSourceFile(sourceFile: string): string {
    const ext = nuclideUri.extname(sourceFile);
    if (ext === '.mm') {
      return 'objective-c++';
    } else if (ext === '.m') {
      return 'objective-c';
    } else if (ext === '.c') {
      return 'c';
    } else {
      return 'c++';
    }
  }

  async _getFlagsFromSourceFileForHeader(
    sourceFile: string,
    requestSettings: ClangRequestSettings,
  ): Promise<?ClangFlags> {
    const data = await this._getFlagsForSrcCached(sourceFile, requestSettings);
    if (data != null) {
      const {rawData} = data;
      if (rawData != null) {
        const xFlag = this._getXFlagForSourceFile(sourceFile);
        let {command} = rawData;
        if (!command.includes('-x ')) {
          command += ` -x ${xFlag}`;
          rawData.command = command;
        }
        if (
          rawData.arguments != null &&
          !rawData.arguments.find(arg => arg === '-x')
        ) {
          rawData.arguments.push('-x', xFlag);
        }
      }
    }
    return data;
  }

  async _getModifiedFlags(
    src: string,
    rawData: ClangCompilationDatabaseEntry,
  ): Promise<Array<string>> {
    const originalFlags =
      rawData.arguments !== undefined
        ? rawData.arguments
        : shellParse(rawData.command);
    // Look for the project-wide flags
    const projectFlagsDir = await fsPromise.findNearestFile(
      PROJECT_CLANG_FLAGS_FILE,
      nuclideUri.dirname(src),
    );
    if (projectFlagsDir == null) {
      return originalFlags;
    }
    const projectFlagsFile = nuclideUri.join(
      projectFlagsDir,
      PROJECT_CLANG_FLAGS_FILE,
    );
    const projectFlags = await this._loadProjectCompilerFlags(projectFlagsFile);
    if (projectFlags == null) {
      return originalFlags;
    }

    return originalFlags
      .filter(flag => projectFlags.ignoredCompilerFlags.indexOf(flag) === -1)
      .concat(projectFlags.extraCompilerFlags);
  }

  async _getDBFlagsAndDirForSrc(
    src: string,
    requestSettings: ClangRequestSettings,
  ): Promise<{
    dbFlags: ?Map<string, ClangFlags>,
    dbDir: ?string,
  }> {
    let dbFlags = null;
    let dbDir = null;
    const compilationDB = requestSettings.compilationDatabase;
    if (compilationDB != null && compilationDB.file != null) {
      // Look for a compilation database provided by the client.
      dbDir = nuclideUri.dirname(compilationDB.file);
      dbFlags = await this.loadFlagsFromCompilationDatabase(requestSettings);
    } else {
      // Look for a manually provided compilation database.
      dbDir = await fsPromise.findNearestFile(
        COMPILATION_DATABASE_FILE,
        nuclideUri.dirname(src),
      );
      if (dbDir != null) {
        const dbFile = nuclideUri.join(dbDir, COMPILATION_DATABASE_FILE);
        const compilationDatabase = {
          file: dbFile,
          flagsFile: null,
          libclangPath: null,
        };
        dbFlags = await this.loadFlagsFromCompilationDatabase({
          compilationDatabase,
          projectRoot: requestSettings.projectRoot,
        });
      }
    }
    return {dbFlags, dbDir};
  }

  async _getRelatedSrcFileForHeader(
    src: string,
    dbFlags: ?Map<string, ClangFlags>,
    projectRoot: ?string,
  ): Promise<?string> {
    if (dbFlags != null) {
      const sourceFile = this._findSourceFileForHeaderFromCompilationDatabase(
        src,
        dbFlags,
      );
      if (sourceFile != null) {
        return sourceFile;
      }
    }
    if (projectRoot != null) {
      return ClangFlagsManager._findSourceFileForHeader(src, projectRoot);
    }
    return null;
  }

  async getRelatedSrcFileForHeader(
    src: string,
    requestSettings: ClangRequestSettings,
  ): Promise<?string> {
    const {dbFlags, dbDir} = await this._getDBFlagsAndDirForSrc(
      src,
      requestSettings,
    );
    const projectRoot =
      requestSettings == null ? null : requestSettings.projectRoot;
    return this._getRelatedSrcFileForHeader(src, dbFlags, projectRoot || dbDir);
  }

  async __getFlagsForSrcImpl(
    src: string,
    requestSettings: ClangRequestSettings,
  ): Promise<?ClangFlags> {
    const {dbFlags, dbDir} = await this._getDBFlagsAndDirForSrc(
      src,
      requestSettings,
    );
    if (dbFlags != null) {
      const flags = dbFlags.get(src);
      if (flags != null) {
        return flags;
      }
    }

    if (isHeaderFile(src)) {
      const sourceFile = await this._getRelatedSrcFileForHeader(
        src,
        dbFlags,
        requestSettings.projectRoot || dbDir,
      );
      if (sourceFile != null) {
        return this._getFlagsFromSourceFileForHeader(
          sourceFile,
          requestSettings,
        );
      }
    }

    const compilationDB = requestSettings.compilationDatabase;
    // Even if we can't get flags, try to watch the build file in case they get added.
    const buildFile =
      compilationDB != null && compilationDB.flagsFile != null
        ? compilationDB.flagsFile
        : await guessBuildFile(src);
    if (buildFile != null) {
      return {
        rawData: null,
        flagsFile: buildFile,
      };
    }

    return null;
  }

  async _loadProjectCompilerFlags(
    flagsFile: string,
  ): Promise<?ClangProjectFlags> {
    let cached = this._clangProjectFlags.get(flagsFile);
    if (cached == null) {
      cached = this._loadProjectCompilerFlagsImpl(flagsFile);
      this._clangProjectFlags.set(flagsFile, cached);
    }
    return cached;
  }

  async _loadProjectCompilerFlagsImpl(
    flagsFile: string,
  ): Promise<?ClangProjectFlags> {
    let result = null;
    try {
      const contents = await fsPromise.readFile(flagsFile, 'utf8');
      const data = JSON.parse(contents);
      invariant(data instanceof Object);
      const {extra_compiler_flags, ignored_compiler_flags} = data;
      const extraCompilerFlags = [];
      const ignoredCompilerFlags = [];

      if (extra_compiler_flags != null) {
        extra_compiler_flags.forEach(flag => extraCompilerFlags.push(flag));
      }
      if (ignored_compiler_flags != null) {
        ignored_compiler_flags.forEach(flag => ignoredCompilerFlags.push(flag));
      }
      result = {extraCompilerFlags, ignoredCompilerFlags};
    } catch (e) {
      logger.error(`Error reading compilation flags from ${flagsFile}`, e);
    }

    return result;
  }

  async _loadFlagsFromCompilationDatabase(
    dbFile: string,
    flagsFile: ?string,
    requestSettings: ClangRequestSettings,
  ): Promise<Map<string, ClangFlags>> {
    const flags = new Map();
    try {
      const contents = await fsPromise.readFile(dbFile, 'utf8');
      const data = JSON.parse(contents);
      const dbDir = nuclideUri.dirname(dbFile);
      await Promise.all(
        data.map(async entry => {
          const {command, file} = entry;
          const directory = await fsPromise.realpath(
            // Relative directories aren't part of the spec, but resolving them
            // relative to the compile_commands.json location seems reasonable.
            nuclideUri.resolve(dbDir, entry.directory),
            this._realpathCache,
          );
          const filename = nuclideUri.resolve(directory, file);
          if (await fsPromise.exists(filename)) {
            const realpath = await fsPromise.realpath(
              filename,
              this._realpathCache,
            );
            const result = {
              rawData: {
                command,
                file,
                directory,
                arguments: entry.arguments,
              },
              flagsFile: flagsFile || dbFile,
            };
            flags.set(realpath, result);
            this._pathToFlags.set(
              [realpath, requestSettings],
              Promise.resolve(result),
            );
          }
        }),
      );
    } catch (e) {
      logger.error(`Error reading compilation flags from ${dbFile}`, e);
    }
    return flags;
  }

  loadFlagsFromCompilationDatabase(
    requestSettings: ClangRequestSettings,
  ): Promise<Map<string, ClangFlags>> {
    const db = requestSettings.compilationDatabase;
    if (db == null) {
      return Promise.resolve(new Map());
    }
    const dbFile = db.file;
    if (dbFile == null) {
      return Promise.resolve(new Map());
    }
    return this._compilationDatabases.getOrCreate(
      db,
      () =>
        this._loadFlagsFromCompilationDatabase(
          dbFile,
          db.flagsFile,
          requestSettings,
        ) || Promise.resolve(new Map()),
    );
  }

  static sanitizeCommand(
    sourceFile: string,
    args_: Array<string>,
    basePath: string,
  ): Array<string> {
    // Make a mutable copy.
    let args = [...args_];
    // For safety, create a new copy of the array. We exclude the path to the file to compile from
    // compilation database generated by Buck. It must be removed from the list of command-line
    // arguments passed to libclang.
    const normalizedSourceFile = nuclideUri.normalize(sourceFile);
    args = args.filter(
      arg =>
        normalizedSourceFile !== arg &&
        normalizedSourceFile !== nuclideUri.resolve(basePath, arg),
    );

    // Resolve relative path arguments against the Buck project root.
    args = mapPathsInFlags(args, path_ => {
      let path = overrideIncludePath(path_);
      if (!nuclideUri.isAbsolute(path)) {
        path = nuclideUri.join(basePath, path);
      }
      return path;
    });

    // If an output file is specified, remove that argument.
    const index = args.indexOf('-o');
    if (index !== -1) {
      args.splice(index, 2);
    }

    return args;
  }

  static async _findSourceFileForHeader(
    header: string,
    projectRoot: string,
  ): Promise<?string> {
    // Basic implementation: look at files in the same directory for paths
    // with matching file names.
    const dir = nuclideUri.dirname(header);
    const files = await fsPromise.readdir(dir);
    const basename = ClangFlagsManager._getFileBasename(header);
    for (const file of files) {
      if (
        isSourceFile(file) &&
        ClangFlagsManager._getFileBasename(file) === basename
      ) {
        return nuclideUri.join(dir, file);
      }
    }

    // Try searching all subdirectories for source files that include this header.
    // Give up after INCLUDE_SEARCH_TIMEOUT.
    return findIncludingSourceFile(header, projectRoot)
      .timeout(INCLUDE_SEARCH_TIMEOUT)
      .catch(() => Observable.of(null))
      .toPromise();
  }

  // Strip off the extension and conventional suffixes like "Internal" and "-inl".
  static _getFileBasename(file: string): string {
    let basename = nuclideUri.basename(file);
    const ext = basename.lastIndexOf('.');
    if (ext !== -1) {
      basename = basename.substr(0, ext);
    }
    return basename.replace(/(Internal|-inl)$/, '');
  }
}
