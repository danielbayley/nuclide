

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/**
 * We choose a length that should be long enough to uniquely identify a ChangeSet with an Hg repo,
 * while also being compact enough to display efficiently in a UI.
 */
var CHANGE_SET_ID_PREFIX_LENGTH = 8;
var HG_BLAME_ERROR_MESSAGE_START = '[abort: ';

/**
 * Parses the output of `hg blame -r "wdir()" -T json --changeset --user --line-number <filename>`.
 * @return A Map that maps line numbers (0-indexed) to the blame info for the line.
 *   The blame info is of the form: "Firstname Lastname <username@email.com> ChangeSetID".
 *   (The Firstname Lastname may not appear sometimes.)
 *   The ChangeSetID will not be the full 40 digit hexadecimal number, but a prefix whose length is
 *   determined by CHANGE_SET_ID_PREFIX_LENGTH.
 */
function parseHgBlameOutput(output) {
  var results = new Map();

  if (output.startsWith(HG_BLAME_ERROR_MESSAGE_START)) {
    return results;
  }

  var arrayOfLineDescriptions = undefined;
  try {
    arrayOfLineDescriptions = JSON.parse(output);
  } catch (e) {
    // The error message may change. An error will return non-JSON.
    return results;
  }
  arrayOfLineDescriptions.forEach(function (lineDescription, index) {
    var changeSetId = lineDescription['node'];
    if (changeSetId != null) {
      changeSetId = changeSetId.substring(0, CHANGE_SET_ID_PREFIX_LENGTH);
    }
    results.set(index.toString(), lineDescription['user'] + ' ' + changeSetId);
  });

  return results;
}

module.exports = {
  parseHgBlameOutput: parseHgBlameOutput
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhnLWJsYW1lLW91dHB1dC1wYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFlQSxJQUFNLDJCQUEyQixHQUFHLENBQUMsQ0FBQztBQUN0QyxJQUFNLDRCQUE0QixHQUFHLFVBQVUsQ0FBQzs7Ozs7Ozs7OztBQVVoRCxTQUFTLGtCQUFrQixDQUFDLE1BQWMsRUFBdUI7QUFDL0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFMUIsTUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLDRCQUE0QixDQUFDLEVBQUU7QUFDbkQsV0FBTyxPQUFPLENBQUM7R0FDaEI7O0FBRUQsTUFBSSx1QkFBdUIsWUFBQSxDQUFDO0FBQzVCLE1BQUk7QUFDRiwyQkFBdUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQzlDLENBQUMsT0FBTyxDQUFDLEVBQUU7O0FBRVYsV0FBTyxPQUFPLENBQUM7R0FDaEI7QUFDRCx5QkFBdUIsQ0FBQyxPQUFPLENBQUMsVUFBQyxlQUFlLEVBQUUsS0FBSyxFQUFLO0FBQzFELFFBQUksV0FBb0IsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkQsUUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO0FBQ3ZCLGlCQUFXLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztLQUNyRTtBQUNELFdBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFLLGVBQWUsQ0FBQyxNQUFNLENBQUMsU0FBSSxXQUFXLENBQUcsQ0FBQztHQUM1RSxDQUFDLENBQUM7O0FBRUgsU0FBTyxPQUFPLENBQUM7Q0FDaEI7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLG9CQUFrQixFQUFsQixrQkFBa0I7Q0FDbkIsQ0FBQyIsImZpbGUiOiJoZy1ibGFtZS1vdXRwdXQtcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuLyoqXG4gKiBXZSBjaG9vc2UgYSBsZW5ndGggdGhhdCBzaG91bGQgYmUgbG9uZyBlbm91Z2ggdG8gdW5pcXVlbHkgaWRlbnRpZnkgYSBDaGFuZ2VTZXQgd2l0aCBhbiBIZyByZXBvLFxuICogd2hpbGUgYWxzbyBiZWluZyBjb21wYWN0IGVub3VnaCB0byBkaXNwbGF5IGVmZmljaWVudGx5IGluIGEgVUkuXG4gKi9cbmNvbnN0IENIQU5HRV9TRVRfSURfUFJFRklYX0xFTkdUSCA9IDg7XG5jb25zdCBIR19CTEFNRV9FUlJPUl9NRVNTQUdFX1NUQVJUID0gJ1thYm9ydDogJztcblxuLyoqXG4gKiBQYXJzZXMgdGhlIG91dHB1dCBvZiBgaGcgYmxhbWUgLXIgXCJ3ZGlyKClcIiAtVCBqc29uIC0tY2hhbmdlc2V0IC0tdXNlciAtLWxpbmUtbnVtYmVyIDxmaWxlbmFtZT5gLlxuICogQHJldHVybiBBIE1hcCB0aGF0IG1hcHMgbGluZSBudW1iZXJzICgwLWluZGV4ZWQpIHRvIHRoZSBibGFtZSBpbmZvIGZvciB0aGUgbGluZS5cbiAqICAgVGhlIGJsYW1lIGluZm8gaXMgb2YgdGhlIGZvcm06IFwiRmlyc3RuYW1lIExhc3RuYW1lIDx1c2VybmFtZUBlbWFpbC5jb20+IENoYW5nZVNldElEXCIuXG4gKiAgIChUaGUgRmlyc3RuYW1lIExhc3RuYW1lIG1heSBub3QgYXBwZWFyIHNvbWV0aW1lcy4pXG4gKiAgIFRoZSBDaGFuZ2VTZXRJRCB3aWxsIG5vdCBiZSB0aGUgZnVsbCA0MCBkaWdpdCBoZXhhZGVjaW1hbCBudW1iZXIsIGJ1dCBhIHByZWZpeCB3aG9zZSBsZW5ndGggaXNcbiAqICAgZGV0ZXJtaW5lZCBieSBDSEFOR0VfU0VUX0lEX1BSRUZJWF9MRU5HVEguXG4gKi9cbmZ1bmN0aW9uIHBhcnNlSGdCbGFtZU91dHB1dChvdXRwdXQ6IHN0cmluZyk6IE1hcDxzdHJpbmcsIHN0cmluZz4ge1xuICBjb25zdCByZXN1bHRzID0gbmV3IE1hcCgpO1xuXG4gIGlmIChvdXRwdXQuc3RhcnRzV2l0aChIR19CTEFNRV9FUlJPUl9NRVNTQUdFX1NUQVJUKSkge1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgbGV0IGFycmF5T2ZMaW5lRGVzY3JpcHRpb25zO1xuICB0cnkge1xuICAgIGFycmF5T2ZMaW5lRGVzY3JpcHRpb25zID0gSlNPTi5wYXJzZShvdXRwdXQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gVGhlIGVycm9yIG1lc3NhZ2UgbWF5IGNoYW5nZS4gQW4gZXJyb3Igd2lsbCByZXR1cm4gbm9uLUpTT04uXG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cbiAgYXJyYXlPZkxpbmVEZXNjcmlwdGlvbnMuZm9yRWFjaCgobGluZURlc2NyaXB0aW9uLCBpbmRleCkgPT4ge1xuICAgIGxldCBjaGFuZ2VTZXRJZDogP3N0cmluZyA9IGxpbmVEZXNjcmlwdGlvblsnbm9kZSddO1xuICAgIGlmIChjaGFuZ2VTZXRJZCAhPSBudWxsKSB7XG4gICAgICBjaGFuZ2VTZXRJZCA9IGNoYW5nZVNldElkLnN1YnN0cmluZygwLCBDSEFOR0VfU0VUX0lEX1BSRUZJWF9MRU5HVEgpO1xuICAgIH1cbiAgICByZXN1bHRzLnNldChpbmRleC50b1N0cmluZygpLCBgJHtsaW5lRGVzY3JpcHRpb25bJ3VzZXInXX0gJHtjaGFuZ2VTZXRJZH1gKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwYXJzZUhnQmxhbWVPdXRwdXQsXG59O1xuIl19