

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _require = require('path');

var pathSeperator = _require.sep;
var normalize = _require.normalize;

var _require2 = require('fs');

var realpathSync = _require2.realpathSync;

/**
 * Returns if the `rootPath` directory contains the `checkPath` which could be:
 *  - A file or directory path that's a direct child of the root path.
 *  - A file or directory path that's a deep child of the root path.
 *  - The exact `rootPath` in an exact or symlinked form.
 *  - May end in a trailing slash if it's a directory path.
 * Follows symlinks to figure out if the real paths of the root and check paths matches.
 */
function containsPathSync(rootPath, checkPath) {
  var realRootPath = null;
  var realCheckPath = null;
  try {
    realRootPath = realpathSync(rootPath);
    realCheckPath = realpathSync(checkPath);
  } catch (e) {
    realRootPath = rootPath;
    realCheckPath = checkPath;
  }

  var normalizedRootPath = normalize(realRootPath);
  var normalizedCheckPath = normalize(realCheckPath);

  var rootPathNumberOfParts = normalizedRootPath.split(pathSeperator).length;
  // Extract the matching piece of the normalized path to compare with the root path.
  var rootPathMatch = normalizedCheckPath.split(pathSeperator).slice(0, rootPathNumberOfParts).join(pathSeperator);
  return rootPathMatch === normalizedRootPath;
}

module.exports = {
  containsPathSync: containsPathSync
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7ZUFXd0MsT0FBTyxDQUFDLE1BQU0sQ0FBQzs7SUFBM0MsYUFBYSxZQUFsQixHQUFHO0lBQWlCLFNBQVMsWUFBVCxTQUFTOztnQkFDYixPQUFPLENBQUMsSUFBSSxDQUFDOztJQUE3QixZQUFZLGFBQVosWUFBWTs7Ozs7Ozs7OztBQVVuQixTQUFTLGdCQUFnQixDQUFDLFFBQWdCLEVBQUUsU0FBaUIsRUFBVztBQUN0RSxNQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDeEIsTUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLE1BQUk7QUFDRixnQkFBWSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QyxpQkFBYSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUN6QyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsZ0JBQVksR0FBRyxRQUFRLENBQUM7QUFDeEIsaUJBQWEsR0FBRyxTQUFTLENBQUM7R0FDM0I7O0FBRUQsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkQsTUFBTSxtQkFBbUIsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRXJELE1BQU0scUJBQXFCLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7QUFFN0UsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUMzRCxLQUFLLENBQUMsQ0FBQyxFQUFFLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3ZELFNBQU8sYUFBYSxLQUFLLGtCQUFrQixDQUFDO0NBQzdDOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixrQkFBZ0IsRUFBaEIsZ0JBQWdCO0NBQ2pCLENBQUMiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5jb25zdCB7c2VwOiBwYXRoU2VwZXJhdG9yLCBub3JtYWxpemV9ID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3Qge3JlYWxwYXRoU3luY30gPSByZXF1aXJlKCdmcycpO1xuXG4vKipcbiAqIFJldHVybnMgaWYgdGhlIGByb290UGF0aGAgZGlyZWN0b3J5IGNvbnRhaW5zIHRoZSBgY2hlY2tQYXRoYCB3aGljaCBjb3VsZCBiZTpcbiAqICAtIEEgZmlsZSBvciBkaXJlY3RvcnkgcGF0aCB0aGF0J3MgYSBkaXJlY3QgY2hpbGQgb2YgdGhlIHJvb3QgcGF0aC5cbiAqICAtIEEgZmlsZSBvciBkaXJlY3RvcnkgcGF0aCB0aGF0J3MgYSBkZWVwIGNoaWxkIG9mIHRoZSByb290IHBhdGguXG4gKiAgLSBUaGUgZXhhY3QgYHJvb3RQYXRoYCBpbiBhbiBleGFjdCBvciBzeW1saW5rZWQgZm9ybS5cbiAqICAtIE1heSBlbmQgaW4gYSB0cmFpbGluZyBzbGFzaCBpZiBpdCdzIGEgZGlyZWN0b3J5IHBhdGguXG4gKiBGb2xsb3dzIHN5bWxpbmtzIHRvIGZpZ3VyZSBvdXQgaWYgdGhlIHJlYWwgcGF0aHMgb2YgdGhlIHJvb3QgYW5kIGNoZWNrIHBhdGhzIG1hdGNoZXMuXG4gKi9cbmZ1bmN0aW9uIGNvbnRhaW5zUGF0aFN5bmMocm9vdFBhdGg6IHN0cmluZywgY2hlY2tQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IHJlYWxSb290UGF0aCA9IG51bGw7XG4gIGxldCByZWFsQ2hlY2tQYXRoID0gbnVsbDtcbiAgdHJ5IHtcbiAgICByZWFsUm9vdFBhdGggPSByZWFscGF0aFN5bmMocm9vdFBhdGgpO1xuICAgIHJlYWxDaGVja1BhdGggPSByZWFscGF0aFN5bmMoY2hlY2tQYXRoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlYWxSb290UGF0aCA9IHJvb3RQYXRoO1xuICAgIHJlYWxDaGVja1BhdGggPSBjaGVja1BhdGg7XG4gIH1cblxuICBjb25zdCBub3JtYWxpemVkUm9vdFBhdGggPSBub3JtYWxpemUocmVhbFJvb3RQYXRoKTtcbiAgY29uc3Qgbm9ybWFsaXplZENoZWNrUGF0aCA9IG5vcm1hbGl6ZShyZWFsQ2hlY2tQYXRoKTtcblxuICBjb25zdCByb290UGF0aE51bWJlck9mUGFydHMgPSBub3JtYWxpemVkUm9vdFBhdGguc3BsaXQocGF0aFNlcGVyYXRvcikubGVuZ3RoO1xuICAvLyBFeHRyYWN0IHRoZSBtYXRjaGluZyBwaWVjZSBvZiB0aGUgbm9ybWFsaXplZCBwYXRoIHRvIGNvbXBhcmUgd2l0aCB0aGUgcm9vdCBwYXRoLlxuICBjb25zdCByb290UGF0aE1hdGNoID0gbm9ybWFsaXplZENoZWNrUGF0aC5zcGxpdChwYXRoU2VwZXJhdG9yKVxuICAgIC5zbGljZSgwLCByb290UGF0aE51bWJlck9mUGFydHMpLmpvaW4ocGF0aFNlcGVyYXRvcik7XG4gIHJldHVybiByb290UGF0aE1hdGNoID09PSBub3JtYWxpemVkUm9vdFBhdGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb250YWluc1BhdGhTeW5jLFxufTtcbiJdfQ==