'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = showTriggerConflictWarning;
function showTriggerConflictWarning() {
  const pkg = atom.config.get('nuclide.hyperclick') == null ? 'hyperclick' : 'nuclide.hyperclick';
  const triggerKeys = atom.config.get(`${pkg}.${process.platform}TriggerKeys`);

  if (!(typeof triggerKeys === 'string')) {
    throw new Error('Invariant violation: "typeof triggerKeys === \'string\'"');
  }

  const triggerKeyDescription = getTriggerDescription(pkg, triggerKeys);
  const { platform } = process;
  const commandOrMeta = platform === 'darwin' ? 'command' : 'meta';
  const optionOrAlt = platform === 'darwin' ? 'option' : 'alt';
  const alternative = triggerKeys === 'altKey,metaKey' ? commandOrMeta : `${commandOrMeta} + ${optionOrAlt}`;
  return atom.notifications.addInfo(`Hyperclick (jump to definition) is using ${triggerKeyDescription}`, {
    description: `If you want to use ${triggerKeyDescription} for multiple cursors instead,` + ' change the Hyperclick "Trigger Keys" setting.<br /><br />' + `(You can still use ${alternative} + click for multiple cursors.)`,
    dismissable: true
  });
} /**
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the license found in the LICENSE file in
   * the root directory of this source tree.
   *
   * 
   * @format
   */

function getTriggerDescription(pkg, trigger) {
  const schema = atom.config.getSchema(`${pkg}.${process.platform}TriggerKeys`);

  if (!(schema != null && schema.enum != null)) {
    throw new Error('Invariant violation: "schema != null && schema.enum != null"');
  }

  const match = schema.enum.find(option => {
    if (!(option != null && typeof option.value === 'string')) {
      throw new Error('Invariant violation: "option != null && typeof option.value === \'string\'"');
    }

    return option.value === trigger;
  });

  if (!(match != null && typeof match.description === 'string')) {
    throw new Error('Invariant violation: "match != null && typeof match.description === \'string\'"');
  }

  return match.description;
}