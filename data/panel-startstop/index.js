/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Called when panel is shown.
 *
 * @param {String} aContentStyle
 * @returns {void}
 */
function onShow(aContentStyle) {
	console.log('[panel/index.js].onShow');
	console.log('Material Design Style: ' + aContentStyle);

	onStyle(aContentStyle);

  //gProjectAutocomplete = new ProjectAutocomplete('startActivityForm');
} // end onShow()

/**
 * Called when panel is hiding.
 *
 * @returns {void}
 */
function onHide() {
	console.log('[panel-startstop/index.js].onHide');
} // end onHide()

/**
 * Called when user changes `contentStyle` preference.
 *
 * @param {String} aContentStyle
 * @returns {void}
 */
function onStyle(aContentStyle) {
	console.log('[panel-startstop/index.js].onStyle');
	console.log('Material Design Style: ' + aContentStyle);

	if (aContentStyle !== undefined) {
		document.body.classList.add(aContentStyle);
	}
} // end onStyle(aContentStyle)

/**
 * Called when panel is hiding.
 *
 * @param {Object} aParams
 * @returns {void}
 */
function onUpdate(aParams) {
	console.log('[panel-startstop/index.js].onUpdate', aParams);

	if ('runningActivity' in aParams) {
		document.getElementById('startFormPanel').classList.add('hide');
		updateStopForm(aParams.runningActivity);
		document.getElementById('startFormPanel').classList.remove('hide');
	} else {
		document.getElementById('stopFormPanel').classList.add('hide');
		document.getElementById('startFormPanel').classList.remove('hide');
	}
} // end onUpdate(aParams)

/**
 * @param {Object} aActivity
 * @returns {void}
 */
function updateStopForm(aActivity) {
	var html = '<h3>' + aActivity.Name + '<h3>';
	document.getElementById('runningActivity').innerHTML = html;
} // end updateStopForm(aActivity)

// ===========================================================================
self.port.on('show', onShow);
self.port.on('hide', onHide);
self.port.on('style', onStyle);
self.port.on('update', onUpdate);
