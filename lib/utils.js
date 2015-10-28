/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @param {Number} aActivityId
 * @param {Number} aProjectId
 * @param {String} aName
 * @param {String} aDescription
 * @param {String} aTags
 * @param {String} aStarted
 * @param {String} aStopped
 * @returns {Object}
 */
function Utils_CreateActivity(aActivityId, aProjectId, aName, aDescription, aTags, aStarted, aStopped) {
	return {
		/** @property {Number} ActivityId */
		get ActivityId() { return aActivityId; },
		set ActivityId(val) { aActivityId = parseInt(val); },
		/** @property {Number} ProjectId */
		get ProjectId() { return aProjectId; },
		set ProjectId(val) { aProjectId = parseInt(val); },
		/** @property {String} Name */
		get Name() { return aName; },
		set Name(val) { aName = val; },
		/** @property {String} Description */
		get Description() { return aDescription; },
		set Description(val) { aDescription = val; },
		/** @property {String} Tags */
		get Tags() { return aTags; },
		set Tags(val) { aTags = val; },
		/** @property {String} Started */
		get Started() { return aStarted; },
		set Started(val) { aStarted = val; },
		/** @property {String} Stopped */
		get Stopped() { return aStopped; },
		set Stopped(val) { aStopped = val; }
	};
} // end Utils_CreateActivity(aActivityId, aProjectId, aName, aDescription, aTags, aStarted, aStopped)

/**
 * @param {Number} aProjectId
 * @param {Number} aName
 * @param {String} aDescription
 * @param {String} aCreated
 * @returns {Object}
 */
function Utils_CreateProject(aProjectId, aName, aDescription, aCreated) {
	return {
		/** @property {Number} ProjectId */
		get ProjectId() { return aProjectId; },
		set ProjectId(val) { aProjectId = parseInt(val); },
		/** @property {String} Name */
		get Name() { return aName; },
		set Name(val) { aName = val; },
		/** @property {String} Description */
		get Description() { return aDescription; },
		set Description(val) { aDescription = val; },
		/** @property {String} Created */
		get Created() { return aCreated; },
		set Created(val) { aCreated = val; }
	};
} // end Utils_CreateProject(aProjectId, aName, aDescription, aCreated)

/**
 * Simple function that returns main color for the used theme.
 * @returns {String}
 * @see https://www.google.com/design/spec/style/color.html#color-color-palette
 */
function Utils_GetThemeColor() {
	let style = require('sdk/simple-prefs').prefs.contentStyle;

	switch (style) {
		case 'red'        : return '#F44336'; break;
		case 'pink'       : return '#E91E63'; break;
		case 'purple'     : return '#9C27B0'; break;
		case 'deep-purple': return '#673AB7'; break;
		case 'indigo'     : return '#3F51B5'; break;
		case 'blue'       : return '#2196F3'; break;
		case 'light-blue' : return '#03A9F4'; break;
		case 'cyan'       : return '#00BCD4'; break;
		case 'teal'       : return '#009688'; break;
		case 'green'      : return '#4CAF50'; break;
		case 'light-green': return '#8BC34A'; break;
		case 'lime'       : return '#CDDC39'; break;
		case 'yellow'     : return '#FFEB3B'; break;
		case 'amber'      : return '#FFC107'; break;
		case 'orange'     : return '#FF9800'; break;
		case 'deep-orange': return '#FF5722'; break;
		case 'brown'      : return '#795548'; break;
		case 'gray'       : return '#9E9E9E'; break;
		case 'blue-gray'  : return '#607D8B'; break;
	}

	return style;
} // end Utils_GetThemeColor()

// ===========================================================================
// Export public functions

exports.createActivity = Utils_CreateActivity;
exports.createProject = Utils_CreateProject;
exports.getThemeColor = Utils_GetThemeColor;
