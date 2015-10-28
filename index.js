/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var self = require('sdk/self');
var { Cc, Ci, Cu } = require('chrome');
//var { setTimeout, clearTimeout } = require('sdk/timers');
var { ToggleButton } = require('sdk/ui/button/toggle');
var { Panel } = require('sdk/panel');

Cu.import('resource://gre/modules/Task.jsm');

/**
 * @type {Object} Add-on's preferences.
 */
const ADDON_PREFS = require('sdk/simple-prefs').prefs;

/**
 * @type {String} Add-on's name taken from `package.json`.
 */
const ADDON_NAME = require('./package.json').name;

/** 
 * @type {String} Add-on's title taken from `package.json`.
 */
const ADDON_TITLE = require('./package.json').title;

/**
 * @type {Object} Some utilities.
 */
var utils = require('lib/utils');

/**
 * @type {Object} Access to the storage.
 * @todo Here we will in future include either `lib/storage-sqlite` or 
 *       `lib/storage-jsonrpc` according to actual user preferences.
 */
var storage = require('lib/storage-sqlite');

/**
 * Add-on's main toolbar button.
 * @var {ToggleButton} gToolbarButton
 */
var gToolbarButton = ToggleButton({
  badge: '⏵',//∎⏸⏵⏯⏮⏭⏬⏩⏪⏫‣
  badgeColor: utils.getThemeColor(),
  //disabled: true,
  icon: {
    '16': self.data.url('icon-16.png'),
    '32': self.data.url('icon-32.png'),
    '64': self.data.url('icon-64.png')
  },
  id: ADDON_NAME + '-button',
  label: ADDON_TITLE,
  onChange: handleToolbarButton
});

/**
 * Add-on's panel attached to the toolbar button.
 * @var {Panel} gToolbarPanel
 */
var gToolbarPanel = Panel({
  contentURL: self.data.url('panel-startstop/index.html'),
  contentScriptFile: self.data.url('panel-startstop/index.js'),
  contentStyleFile: self.data.url('panel-startstop/index.css'),
  width: 400,
  height: 420,
  /**
   * Called when panel is shown.
   */
  onShow: function () {
    gToolbarPanel.port.emit('show', ADDON_PREFS.contentStyle);
  },
  /**
   * Called when panel is hiding - switching checked of the main toolbar button.
   */
  onHide: function () {
    gToolbarPanel.port.emit('hide');
    gToolbarButton.state('window', { checked: false });
  }
});

/**
 * Handles click on main toolbar button.
 * @param {Object} aState
 */
function handleToolbarButton(aState) {
  if (aState.checked === true) {
    gToolbarPanel.show({ position: gToolbarButton });
  }
} // end handleToolbarButton(aState)

/**
 * Listener for change value of `contentStyle` preference.
 */
function onContentStylePrefChange() {
  gToolbarButton.badgeColor = utils.getThemeColor();
  gToolbarPanel.port.emit('style', ADDON_PREFS.contentStyle);
} // end onContentStylePrefChange()

// Listens to preferences values changes.
require('sdk/simple-prefs').on('contentStyle', onContentStylePrefChange);
