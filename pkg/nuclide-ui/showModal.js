'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = showModal;

var _react = _interopRequireDefault(require('react'));

var _reactDom = _interopRequireDefault(require('react-dom'));

var _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');

var _UniversalDisposable;

function _load_UniversalDisposable() {
  return _UniversalDisposable = _interopRequireDefault(require('nuclide-commons/UniversalDisposable'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Shows a modal dialog that renders a React element as its content.
 * The modal is automatically hidden when the user clicks outside of it, and on core:cancel (esc).
 * The modal panel unmounts its React component and destroys the panel as soon as it is hidden;
 * you may not hide the panel and then re-show it later.
 * Returns a disposable that you may use to hide and destroy the modal.
 */


/**
 * Given a function to dismiss the modal, return a React element for the content.
 * Call the function when e.g. the user clicks a Cancel or Submit button.
 */


/** Wrap options in an object so we can add new ones later without an explosion of params */
function showModal(contentFactory, options = defaults) {
  const hostElement = document.createElement('div');
  const atomPanel = atom.workspace.addModalPanel({
    item: hostElement,
    priority: options.priority,
    className: options.className
  });
  const disposable = new (_UniversalDisposable || _load_UniversalDisposable()).default(options.disableDismissOnClickOutsideModal ? () => undefined : _rxjsBundlesRxMinJs.Observable.fromEvent(document, 'mousedown').subscribe(({ target }) => {
    if (!(target instanceof Node)) {
      throw new Error('Invariant violation: "target instanceof Node"');
    }

    if (!atomPanel.getItem().contains(target)) {
      atomPanel.hide();
    }
  }), atomPanel.onDidChangeVisible(visible => {
    if (!visible) {
      disposable.dispose();
    }
  }), atom.commands.add('atom-workspace', 'core:cancel', () => disposable.dispose()), () => {
    // Call onDismiss before unmounting the component and destroying the panel:
    if (options.onDismiss) {
      options.onDismiss();
    }
    _reactDom.default.unmountComponentAtNode(hostElement);
    atomPanel.destroy();
  });

  _reactDom.default.render(_react.default.createElement(
    ModalContainer,
    null,
    contentFactory(disposable.dispose.bind(disposable))
  ), hostElement);
  return disposable;
}

/** Flow makes {} an unsealed object (eyeroll) */
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 * @format
 */
/* global Node */
/* global HTMLElement */

const defaults = Object.freeze({});

/**
 * Just exists to provide a div that we can focus on mount. This ensures we steal focus from any
 * editors or other panes while the modal is present.
 */
class ModalContainer extends _react.default.Component {

  render() {
    return _react.default.createElement(
      'div',
      { tabIndex: '-1' },
      this.props.children
    );
  }

  componentDidMount() {
    const node = _reactDom.default.findDOMNode(this);

    if (!(node instanceof HTMLElement)) {
      throw new Error('Invariant violation: "node instanceof HTMLElement"');
    }
    // Steal the focus away from any active editor or pane, setting it on the modal;
    // but don't steal focus away from a descendant. This can happen if a React element focuses
    // during its componentDidMount. For example, <AtomInput> does this since the underlying
    // <atom-text-editor> does not support the autofocus attribute.


    if (!node.contains(document.activeElement)) {
      node.focus();
    }
  }
}