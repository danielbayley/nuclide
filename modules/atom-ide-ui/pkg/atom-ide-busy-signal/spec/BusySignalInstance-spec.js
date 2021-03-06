/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 * @format
 */

import type {BusySignalOptions} from '../lib/types';

import {MessageStore} from '../lib/MessageStore';
import BusySignalInstance from '../lib/BusySignalInstance';

describe('BusySignalInstance', () => {
  let messageStore: MessageStore;
  let instance: BusySignalInstance;
  let messages: Array<Array<string>>;
  const options: BusySignalOptions = {debounce: false};

  beforeEach(() => {
    messageStore = new MessageStore();
    instance = new BusySignalInstance(messageStore);
    messages = [];
    messageStore.getMessageStream().skip(1).subscribe(elements => {
      const strings = elements.map(element => {
        const child =
          element.childNodes.length >= 1 ? element.childNodes[0] : {};
        return child.data != null && typeof child.data === 'string'
          ? child.data
          : '';
      });
      messages.push(strings);
    });
  });

  it('should record messages before and after a call', () => {
    expect(messages.length).toBe(0);
    instance.reportBusyWhile('foo', () => Promise.resolve(5), options);
    expect(messages.length).toBe(1);
    waitsFor(
      () => messages.length === 2,
      'It should publish a second message',
      100,
    );
  });

  it("should send the 'done' message even if the promise rejects", () => {
    instance.reportBusyWhile('foo', () => Promise.reject(new Error()), options);
    expect(messages.length).toBe(1);
    waitsFor(
      () => messages.length === 2,
      'It should publish a second message',
      100,
    );
  });

  it('should properly display duplicate messages', () => {
    const dispose1 = instance.reportBusy('foo', options);
    expect(messages.length).toBe(1);
    expect(messages[0]).toEqual(['foo']);

    const dispose2 = instance.reportBusy('foo', options);
    expect(messages.length).toBe(2);
    expect(messages[1]).toEqual(['foo', 'foo']);

    dispose2.dispose();
    expect(messages.length).toBe(3);
    expect(messages[2]).toEqual(['foo']);

    dispose1.dispose();
    expect(messages.length).toBe(4);
    expect(messages[3]).toEqual([]);
  });

  describe('when onlyForFile is provided', () => {
    let editor1: atom$TextEditor = (null: any);
    let editor2: atom$TextEditor = (null: any);
    let editor3: atom$TextEditor = (null: any);

    beforeEach(() => {
      waitsForPromise(async () => {
        editor1 = await atom.workspace.open('/file1.txt');
        editor2 = await atom.workspace.open('/file2.txt');
        editor3 = await atom.workspace.open();
      });
    });

    afterEach(() => {
      [editor1, editor2, editor3].forEach(editor => editor.destroy());
    });

    it('should only display for the proper text editor', () => {
      atom.workspace.getActivePane().activateItem(editor1);

      const disposable = instance.reportBusy('foo', {
        onlyForFile: '/file2.txt',
        ...options,
      });
      expect(messages).toEqual([]);

      atom.workspace.getActivePane().activateItem(editor2);
      expect(messages.length).toBe(1);
      expect(messages[0]).toEqual(['foo']);

      atom.workspace.getActivePane().activateItem(editor3);
      expect(messages.length).toBe(2);
      expect(messages[1]).toEqual([]);

      atom.workspace.getActivePane().activateItem(editor2);
      expect(messages.length).toBe(3);
      expect(messages[2]).toEqual(['foo']);

      disposable.dispose();
      expect(messages.length).toBe(4);
      expect(messages[3]).toEqual([]);
    });
  });
});
