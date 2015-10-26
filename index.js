/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var { Cu } = require('chrome');
var pageMod = require('sdk/page-mod');
var panels = require('sdk/panel');
var self = require('sdk/self');
var tabs = require('sdk/tabs');
var ui = require('sdk/ui');
var panelUrl = self.data.url('page.html');
var serverUrl = 'http://odtimetracker.local';

/**
 * @param {Tab} aTab
 * @returns {void}
 */
function onPanelReady(aTab) {
	var worker = aTab.attach({
		contentScriptFile: self.data.url('page.js')
	});

	// Listen for request for close page (tab).
	worker.port.on('close', function() {
    console.log('"close" emmitted');
		worker.tab.close();
	});

	// Listen for request for refreshing dataview
	worker.port.on('refresh', function() {
    console.log('"refresh" emmitted');
		//refreshDataView(worker);
	});

	// Listen for saving new URL
	worker.port.on('insert', function(aUrl) {
    console.log('"insert" emmitted');
	});

	// Listen for URLs removal request
	worker.port.on('delete', function(aUrlIds) {
    console.log('"delete" emmitted');
	});

	worker.port.emit('load', null);
} // end onPanelReady(aTab)

// Panel attached to main toolbar button
var MainPanel = panels.Panel({
  contentURL: panelUrl,
  onHide: handleMainPanelHide
});

// Main toolbar button.
var MainButton = ui.ToggleButton({
	id: 'odtimetracker-btn',
  badge: '⏵',//∎⏸⏵⏯⏮⏭⏬⏩⏪⏫‣
	label: 'odTimeTracker',
	icon: {
		16: self.data.url('icon-16.png'),
		32: self.data.url('icon-32.png'),
		64: self.data.url('icon-64.png')
	},
	onChange: handleMainButtonChange
});

/**
 * @returns {void}
 */
function handleMainPanelHide() {
  MainButton.state('window', {checked: false});
} // end handleMainPanelHide()

/**
 * @param {Object} aState
 * @returns {void}
 */
function handleMainButtonChange(aState) {
  if (aState.checked) {
    MainPanel.show({ position: MainButton });
  }
} // end onMainButtonChange()
