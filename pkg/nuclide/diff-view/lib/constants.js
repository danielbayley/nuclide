var _HgStatusToFileChangeStatus, _FileChangeStatusToPrefix;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var HgStatusCodeNumber = require('../../hg-repository-base').hgConstants.StatusCodeNumber;

var FileChangeStatus = {
  ADDED: 1,
  MODIFIED: 2,
  MISSING: 3,
  REMOVED: 4,
  UNTRACKED: 5
};

var DiffMode = {
  BROWSE_MODE: 'Browse',
  COMMIT_MODE: 'Commit',
  PUBLISH_MODE: 'Publish'
};

// This is to work around flow's missing support of enums.
DiffMode;

var CommitMode = {
  COMMIT: 'Commit',
  AMEND: 'Amend'
};

// This is to work around flow's missing support of enums.
CommitMode;

var CommitModeState = {
  READY: 'Ready',
  LOADING_COMMIT_MESSAGE: 'Loading Commit Message',
  AWAITING_COMMIT: 'Awaiting Commit'
};

// This is to work around flow's missing support of enums.
CommitModeState;

var PublishMode = {
  CREATE: 'Create',
  UPDATE: 'Update'
};

// This is to work around flow's missing support of enums.
PublishMode;

var PublishModeState = {
  READY: 'Ready',
  LOADING_PUBLISH_MESSAGE: 'Loading Publish Message',
  AWAITING_PUBLISH: 'Awaiting Publish'
};

// This is to work around flow's missing support of enums.
PublishModeState;

var HgStatusToFileChangeStatus = (_HgStatusToFileChangeStatus = {}, _defineProperty(_HgStatusToFileChangeStatus, HgStatusCodeNumber.ADDED, FileChangeStatus.ADDED), _defineProperty(_HgStatusToFileChangeStatus, HgStatusCodeNumber.MODIFIED, FileChangeStatus.MODIFIED), _defineProperty(_HgStatusToFileChangeStatus, HgStatusCodeNumber.MISSING, FileChangeStatus.MISSING), _defineProperty(_HgStatusToFileChangeStatus, HgStatusCodeNumber.REMOVED, FileChangeStatus.REMOVED), _defineProperty(_HgStatusToFileChangeStatus, HgStatusCodeNumber.UNTRACKED, FileChangeStatus.UNTRACKED), _HgStatusToFileChangeStatus);

var FileChangeStatusToPrefix = (_FileChangeStatusToPrefix = {}, _defineProperty(_FileChangeStatusToPrefix, FileChangeStatus.ADDED, '[A] '), _defineProperty(_FileChangeStatusToPrefix, FileChangeStatus.MODIFIED, '[M] '), _defineProperty(_FileChangeStatusToPrefix, FileChangeStatus.MISSING, '[!] '), _defineProperty(_FileChangeStatusToPrefix, FileChangeStatus.REMOVED, '[D] '), _defineProperty(_FileChangeStatusToPrefix, FileChangeStatus.UNTRACKED, '[?] '), _FileChangeStatusToPrefix);

module.exports = {
  DiffMode: DiffMode,
  CommitMode: CommitMode,
  CommitModeState: CommitModeState,
  PublishMode: PublishMode,
  PublishModeState: PublishModeState,
  FileChangeStatus: FileChangeStatus,
  HgStatusToFileChangeStatus: HgStatusToFileChangeStatus,
  FileChangeStatusToPrefix: FileChangeStatusToPrefix,
  HgStatusCodeNumber: HgStatusCodeNumber
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnN0YW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFXeUIsa0JBQWtCLEdBQUksT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUMsV0FBVyxDQUF2RixnQkFBZ0I7O0FBWXZCLElBQU0sZ0JBQXdELEdBQUc7QUFDL0QsT0FBSyxFQUFFLENBQUM7QUFDUixVQUFRLEVBQUUsQ0FBQztBQUNYLFNBQU8sRUFBRSxDQUFDO0FBQ1YsU0FBTyxFQUFFLENBQUM7QUFDVixXQUFTLEVBQUUsQ0FBQztDQUNiLENBQUM7O0FBRUYsSUFBTSxRQUFRLEdBQUc7QUFDZixhQUFXLEVBQUUsUUFBUTtBQUNyQixhQUFXLEVBQUUsUUFBUTtBQUNyQixjQUFZLEVBQUUsU0FBUztDQUN4QixDQUFDOzs7QUFHRixBQUFDLFFBQVEsQ0FBbUM7O0FBRTVDLElBQU0sVUFBVSxHQUFHO0FBQ2pCLFFBQU0sRUFBRSxRQUFRO0FBQ2hCLE9BQUssRUFBRSxPQUFPO0NBQ2YsQ0FBQzs7O0FBR0YsQUFBQyxVQUFVLENBQXFDOztBQUVoRCxJQUFNLGVBQWUsR0FBRztBQUN0QixPQUFLLEVBQUUsT0FBTztBQUNkLHdCQUFzQixFQUFFLHdCQUF3QjtBQUNoRCxpQkFBZSxFQUFFLGlCQUFpQjtDQUNuQyxDQUFDOzs7QUFHRixBQUFDLGVBQWUsQ0FBMEM7O0FBRTFELElBQU0sV0FBVyxHQUFHO0FBQ2xCLFFBQU0sRUFBRSxRQUFRO0FBQ2hCLFFBQU0sRUFBRSxRQUFRO0NBQ2pCLENBQUM7OztBQUdGLEFBQUMsV0FBVyxDQUFzQzs7QUFFbEQsSUFBTSxnQkFBZ0IsR0FBRztBQUN2QixPQUFLLEVBQUUsT0FBTztBQUNkLHlCQUF1QixFQUFFLHlCQUF5QjtBQUNsRCxrQkFBZ0IsRUFBRSxrQkFBa0I7Q0FDckMsQ0FBQzs7O0FBR0YsQUFBQyxnQkFBZ0IsQ0FBMkM7O0FBRzVELElBQU0sMEJBQWtGLG1GQUNyRixrQkFBa0IsQ0FBQyxLQUFLLEVBQUcsZ0JBQWdCLENBQUMsS0FBSyxnREFDakQsa0JBQWtCLENBQUMsUUFBUSxFQUFHLGdCQUFnQixDQUFDLFFBQVEsZ0RBQ3ZELGtCQUFrQixDQUFDLE9BQU8sRUFBRyxnQkFBZ0IsQ0FBQyxPQUFPLGdEQUNyRCxrQkFBa0IsQ0FBQyxPQUFPLEVBQUcsZ0JBQWdCLENBQUMsT0FBTyxnREFDckQsa0JBQWtCLENBQUMsU0FBUyxFQUFHLGdCQUFnQixDQUFDLFNBQVMsK0JBQzNELENBQUM7O0FBRUYsSUFBTSx3QkFBZ0UsK0VBQ25FLGdCQUFnQixDQUFDLEtBQUssRUFBRyxNQUFNLDhDQUMvQixnQkFBZ0IsQ0FBQyxRQUFRLEVBQUcsTUFBTSw4Q0FDbEMsZ0JBQWdCLENBQUMsT0FBTyxFQUFHLE1BQU0sOENBQ2pDLGdCQUFnQixDQUFDLE9BQU8sRUFBRyxNQUFNLDhDQUNqQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUcsTUFBTSw2QkFDckMsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YsVUFBUSxFQUFSLFFBQVE7QUFDUixZQUFVLEVBQVYsVUFBVTtBQUNWLGlCQUFlLEVBQWYsZUFBZTtBQUNmLGFBQVcsRUFBWCxXQUFXO0FBQ1gsa0JBQWdCLEVBQWhCLGdCQUFnQjtBQUNoQixrQkFBZ0IsRUFBaEIsZ0JBQWdCO0FBQ2hCLDRCQUEwQixFQUExQiwwQkFBMEI7QUFDMUIsMEJBQXdCLEVBQXhCLHdCQUF3QjtBQUN4QixvQkFBa0IsRUFBbEIsa0JBQWtCO0NBQ25CLENBQUMiLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuY29uc3Qge1N0YXR1c0NvZGVOdW1iZXI6IEhnU3RhdHVzQ29kZU51bWJlcn0gPSByZXF1aXJlKCcuLi8uLi9oZy1yZXBvc2l0b3J5LWJhc2UnKS5oZ0NvbnN0YW50cztcblxuaW1wb3J0IHR5cGUge1N0YXR1c0NvZGVOdW1iZXJWYWx1ZX0gZnJvbSAnLi4vLi4vaGctcmVwb3NpdG9yeS1iYXNlL2xpYi9IZ1NlcnZpY2UnO1xuaW1wb3J0IHR5cGUge1xuICBDb21taXRNb2RlVHlwZSxcbiAgQ29tbWl0TW9kZVN0YXRlVHlwZSxcbiAgRGlmZk1vZGVUeXBlLFxuICBGaWxlQ2hhbmdlU3RhdHVzVmFsdWUsXG4gIFB1Ymxpc2hNb2RlVHlwZSxcbiAgUHVibGlzaE1vZGVTdGF0ZVR5cGUsXG59IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBGaWxlQ2hhbmdlU3RhdHVzOiB7W2tleTogc3RyaW5nXTogRmlsZUNoYW5nZVN0YXR1c1ZhbHVlfSA9IHtcbiAgQURERUQ6IDEsXG4gIE1PRElGSUVEOiAyLFxuICBNSVNTSU5HOiAzLFxuICBSRU1PVkVEOiA0LFxuICBVTlRSQUNLRUQ6IDUsXG59O1xuXG5jb25zdCBEaWZmTW9kZSA9IHtcbiAgQlJPV1NFX01PREU6ICdCcm93c2UnLFxuICBDT01NSVRfTU9ERTogJ0NvbW1pdCcsXG4gIFBVQkxJU0hfTU9ERTogJ1B1Ymxpc2gnLFxufTtcblxuLy8gVGhpcyBpcyB0byB3b3JrIGFyb3VuZCBmbG93J3MgbWlzc2luZyBzdXBwb3J0IG9mIGVudW1zLlxuKERpZmZNb2RlOiB7IFtrZXk6IHN0cmluZ106IERpZmZNb2RlVHlwZSB9KTtcblxuY29uc3QgQ29tbWl0TW9kZSA9IHtcbiAgQ09NTUlUOiAnQ29tbWl0JyxcbiAgQU1FTkQ6ICdBbWVuZCcsXG59O1xuXG4vLyBUaGlzIGlzIHRvIHdvcmsgYXJvdW5kIGZsb3cncyBtaXNzaW5nIHN1cHBvcnQgb2YgZW51bXMuXG4oQ29tbWl0TW9kZTogeyBba2V5OiBzdHJpbmddOiBDb21taXRNb2RlVHlwZSB9KTtcblxuY29uc3QgQ29tbWl0TW9kZVN0YXRlID0ge1xuICBSRUFEWTogJ1JlYWR5JyxcbiAgTE9BRElOR19DT01NSVRfTUVTU0FHRTogJ0xvYWRpbmcgQ29tbWl0IE1lc3NhZ2UnLFxuICBBV0FJVElOR19DT01NSVQ6ICdBd2FpdGluZyBDb21taXQnLFxufTtcblxuLy8gVGhpcyBpcyB0byB3b3JrIGFyb3VuZCBmbG93J3MgbWlzc2luZyBzdXBwb3J0IG9mIGVudW1zLlxuKENvbW1pdE1vZGVTdGF0ZTogeyBba2V5OiBzdHJpbmddOiBDb21taXRNb2RlU3RhdGVUeXBlIH0pO1xuXG5jb25zdCBQdWJsaXNoTW9kZSA9IHtcbiAgQ1JFQVRFOiAnQ3JlYXRlJyxcbiAgVVBEQVRFOiAnVXBkYXRlJyxcbn07XG5cbi8vIFRoaXMgaXMgdG8gd29yayBhcm91bmQgZmxvdydzIG1pc3Npbmcgc3VwcG9ydCBvZiBlbnVtcy5cbihQdWJsaXNoTW9kZTogeyBba2V5OiBzdHJpbmddOiBQdWJsaXNoTW9kZVR5cGUgfSk7XG5cbmNvbnN0IFB1Ymxpc2hNb2RlU3RhdGUgPSB7XG4gIFJFQURZOiAnUmVhZHknLFxuICBMT0FESU5HX1BVQkxJU0hfTUVTU0FHRTogJ0xvYWRpbmcgUHVibGlzaCBNZXNzYWdlJyxcbiAgQVdBSVRJTkdfUFVCTElTSDogJ0F3YWl0aW5nIFB1Ymxpc2gnLFxufTtcblxuLy8gVGhpcyBpcyB0byB3b3JrIGFyb3VuZCBmbG93J3MgbWlzc2luZyBzdXBwb3J0IG9mIGVudW1zLlxuKFB1Ymxpc2hNb2RlU3RhdGU6IHsgW2tleTogc3RyaW5nXTogUHVibGlzaE1vZGVTdGF0ZVR5cGUgfSk7XG5cblxuY29uc3QgSGdTdGF0dXNUb0ZpbGVDaGFuZ2VTdGF0dXMgOiB7W2tleTogU3RhdHVzQ29kZU51bWJlclZhbHVlXTogRmlsZUNoYW5nZVN0YXR1c1ZhbHVlfSA9IHtcbiAgW0hnU3RhdHVzQ29kZU51bWJlci5BRERFRF06IEZpbGVDaGFuZ2VTdGF0dXMuQURERUQsXG4gIFtIZ1N0YXR1c0NvZGVOdW1iZXIuTU9ESUZJRURdOiBGaWxlQ2hhbmdlU3RhdHVzLk1PRElGSUVELFxuICBbSGdTdGF0dXNDb2RlTnVtYmVyLk1JU1NJTkddOiBGaWxlQ2hhbmdlU3RhdHVzLk1JU1NJTkcsXG4gIFtIZ1N0YXR1c0NvZGVOdW1iZXIuUkVNT1ZFRF06IEZpbGVDaGFuZ2VTdGF0dXMuUkVNT1ZFRCxcbiAgW0hnU3RhdHVzQ29kZU51bWJlci5VTlRSQUNLRURdOiBGaWxlQ2hhbmdlU3RhdHVzLlVOVFJBQ0tFRCxcbn07XG5cbmNvbnN0IEZpbGVDaGFuZ2VTdGF0dXNUb1ByZWZpeDoge1trZXk6IEZpbGVDaGFuZ2VTdGF0dXNWYWx1ZV06IHN0cmluZ30gPSB7XG4gIFtGaWxlQ2hhbmdlU3RhdHVzLkFEREVEXTogJ1tBXSAnLFxuICBbRmlsZUNoYW5nZVN0YXR1cy5NT0RJRklFRF06ICdbTV0gJyxcbiAgW0ZpbGVDaGFuZ2VTdGF0dXMuTUlTU0lOR106ICdbIV0gJyxcbiAgW0ZpbGVDaGFuZ2VTdGF0dXMuUkVNT1ZFRF06ICdbRF0gJyxcbiAgW0ZpbGVDaGFuZ2VTdGF0dXMuVU5UUkFDS0VEXTogJ1s/XSAnLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIERpZmZNb2RlLFxuICBDb21taXRNb2RlLFxuICBDb21taXRNb2RlU3RhdGUsXG4gIFB1Ymxpc2hNb2RlLFxuICBQdWJsaXNoTW9kZVN0YXRlLFxuICBGaWxlQ2hhbmdlU3RhdHVzLFxuICBIZ1N0YXR1c1RvRmlsZUNoYW5nZVN0YXR1cyxcbiAgRmlsZUNoYW5nZVN0YXR1c1RvUHJlZml4LFxuICBIZ1N0YXR1c0NvZGVOdW1iZXIsXG59O1xuIl19