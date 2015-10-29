/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Contains all necessary functions for working with Feeds Reader SQLite storage.
 */

var { Cc, Ci, Cu } = require('chrome');

Cu.import('resource://gre/modules/Sqlite.jsm');
Cu.import('resource://gre/modules/Task.jsm');

/**
 * @type {Object} Some utilities.
 */
var utils = require('lib/utils');

/**
 * @type {String} Path to SQLite database file.
 */
var storageFile = getDatabaseFilePath();

/**
 * @type {Boolean}
 */
var storageInitialized = false;

/**
 * @returns {String} Path to our SQLite database.
 */
function getDatabaseFilePath() {
	// Get profile directory.
	var file = Cc['@mozilla.org/file/directory_service;1'].
		getService(Ci.nsIProperties).
		get('ProfD', Ci.nsIFile);

	// Append the file name.
	file.append('odtimetracker.sqlite');

	return file.path;
} // end getDatabaseFilePath()

/**
 * Create database schema.
 * @returns {Promise}
 */
function createSchema() {
	return Task.spawn(
		function* createSchema() {
			let conn = yield Sqlite.openConnection({ path: storageFile });

			try {
				yield conn.execute('PRAGMA foreign_keys = ON;');
				yield conn.execute(
					'CREATE TABLE Projects ('+
					'	ProjectId INTEGER PRIMARY KEY,'+
					'	Name TEXT,'+
					'	Description TEXT,'+
					'	Created TEXT NOT NULL'+
					')'
				);
				yield conn.execute(
					'CREATE TABLE Activities ('+
					'	ActivityId INTEGER PRIMARY KEY,'+
					'	ProjectId INTEGER NOT NULL,'+
					'	Name TEXT,'+
					'	Description TEXT,'+
					'	Tags TEXT,'+
					'	Started TEXT NOT NULL,'+
					'	Stopped TEXT NOT NULL DEFAULT "",'+
					'	FOREIGN KEY(ProjectId) REFERENCES Projects(ProjectId)'+
					')'
				);
				yield conn.execute('PRAGMA user_version = 1;');

				return true;
			} catch(e) {
				console.error(e);
				return false;
			} finally {
				yield conn.close();
			}
		}
	);
} // end createSchema()

// ===========================================================================
// Public methods:

/**
 * @returns {Promise}
 */
function Storage_GetVersion() {
	return Task.spawn(
		function* getStorageVersion() {
			let conn = yield Sqlite.openConnection({ path: storageFile });
	
			try {
				let result = yield conn.execute('PRAGMA user_version;')
				return (parseInt(result[0].getResultByIndex(0)));
			} catch(e) {
				console.error(e);
				return 0;
			} finally {
				yield conn.close();
			}
		}
	);
} // end Storage_GetVersion()

/**
 * @param {Object} aActivity
 * @param {Object} aOptions
 * @returns {Promise}
 * @todo Implement this!
 */
function Storage_ActivityInsert(aActivity, aOptions) {
	return Task.spawn(
		function* insertActivity() {
			console.error("Not implemented yet!");
			return false;
		}
	);
} // end Storage_ActivityInsert(aActivity, aOptions)

/**
 * @param {Object} aOptions
 * @returns {Promise}
 * @todo Implement this!
 */
function Storage_ActivityRemove(aOptions) {
	return Task.spawn(
		function* removeActivity() {
			console.error("Not implemented yet!");
			return false;
		}
	);
} // end Storage_ActivityRemove(aOptions)

/**
 * @param {Object} aOptions Use `{ 'selectRunning': true }` for selecting
 *                          the currently running activity.
 * @returns {Promise}
 * @todo Implement filtering/ordering!
 */
function Storage_ActivitySelect(aOptions) {
	return Task.spawn(
		function* selectActivity() {
			let conn = yield Sqlite.openConnection({ path: storageFile });
			let data = [];
			let sql  = 'SELECT * FROM Activities WHERE 1 ';

			if ('selectRunning' in aOptions) {
				sql = sql + 'AND Stopped IS NULL ';
			} else {
				// TODO Process other options...
			}

			try {
				let result = yield conn.execute(sql);

				for (let row of result) {
					data.push(utils.createActivity(
						row.getResultByName('ActivityId'),
						row.getResultByName('ProjectId'),
						row.getResultByName('Name'),
						row.getResultByName('Description'),
						row.getResultByName('Tags'),
						row.getResultByName('Started'),
						row.getResultByName('Stopped')
					));
				}

				return data;
			} catch(e) {
				console.error(e);
				return false;
			} finally {
				yield conn.close();
			}
		}
	);
} // end Storage_ActivitySelect(aOptions)

/**
 * @param {Object} aActivity
 * @returns {Promise}
 * @todo Implement this!
 */
function Storage_ActivityStart(aActivity) {
	return Task.spawn(
		function* startActivity() {
			console.error("Not implemented yet!");
			return false;
		}
	);
} // end Storage_ActivityStart(aActivity)

/**
 * @returns {Promise}
 * @todo Implement this!
 */
function Storage_ActivityStop() {
	return Task.spawn(
		function* stopActivity() {
			console.error("Not implemented yet!");
			return false;
		}
	);
} // end Storage_ActivityStop()

/**
 * @param {Object} aActivity
 * @param {Object} aOptions
 * @returns {Promise}
 * @todo Implement this!
 */
function Storage_ActivityUpdate(aActivity, aOptions) {
	return Task.spawn(
		function* updateActivity() {
			console.error("Not implemented yet!");
			return false;
		}
	);
} // end Storage_ActivityUpdate(aActivity, aOptions)

/**
 * @param {Object} aProject
 * @param {Object} aOptions
 * @returns {Promise}
 * @todo Implement this!
 */
function Storage_ProjectInsert(aProject, aOptions) {
	return Task.spawn(
		function* insertProject() {
			console.error("Not implemented yet!");
			return false;
		}
	);
} // end Storage_ProjectInsert(aActivity, aOptions)

/**
 * @param {Object} aOptions
 * @returns {Promise}
 * @todo Implement this!
 */
function Storage_ProjectRemove(aOptions) {
	return Task.spawn(
		function* removeProject() {
			console.error("Not implemented yet!");
			return false;
		}
	);
} // end Storage_ProjectRemove(aOptions)

/**
 * @param {Object} aOptions
 * @returns {Promise}
 * @todo Implement filtering/ordering!
 */
function Storage_ProjectSelect(aOptions) {
	return Task.spawn(
		function* selectProject() {
			let conn = yield Sqlite.openConnection({ path: storageFile });
			let data = [];
	
			try {
				let result = yield conn.execute(
					'SELECT * FROM Projects WHERE CategoryId = ?;', 
					[aCategoryId]
				);

				for (let row of result) {
					data.push(utils.createProject(
						row.getResultByName('ProjectId'),
						row.getResultByName('Name'),
						row.getResultByName('Description'),
						row.getResultByName('Created')
					));
				}

				return data;
			} catch(e) {
				console.error(e);
				return false;
			} finally {
				yield conn.close();
			}
		}
	);
} // end Storage_ProjectSelect(aOptions)

/**
 * @param {Object} aProject
 * @param {Object} aOptions
 * @returns {Promise}
 * @todo Implement this!
 */
function Storage_ProjectUpdate(aProject, aOptions) {
	return Task.spawn(
		function* updateProject() {
			console.error("Not implemented yet!");
			return false;
		}
	);
} // end Storage_ProjectUpdate(aProject, aOptions)

// ===========================================================================
// Initialize database:

console.log('Initializing SQLite storage...');
Storage_GetVersion().then(
	function (aVersion) {
		if (aVersion >= 1) {
			return;// We have nothing to do here.
		}

		// Database schema needs to be created.
		createSchema().then(function (aResult) {
			console.log('> schema created');
			storageInitialized = (aResult === true);
		});
	},
	function (aError) {
		console.log('> error occured', aError);
		storageInitialized = false;
	}
);

// ===========================================================================
// Export:

// TODO This should corresponds with `odtimetracker/http-jsonrpc-php` API 
//      (with exception of `createSchema` method) and with other storage 
//      libraries (there will be `storage-sqlite` (this one) and another 
//      for using server instead of local storage: `storage-jsonrpc`).

// Regular API:
exports.activityInsert = Storage_ActivityInsert;
exports.activityRemove = Storage_ActivityRemove;
exports.activitySelect = Storage_ActivitySelect;
exports.activityStart  = Storage_ActivityStart;
exports.activityStop   = Storage_ActivityStop;
exports.activityUpdate = Storage_ActivityUpdate;
exports.getVersion     = Storage_GetVersion;
exports.projectInsert  = Storage_ProjectInsert;
exports.projectRemove  = Storage_ProjectRemove;
exports.projectSelect  = Storage_ProjectSelect;
exports.projectUpdate  = Storage_ProjectUpdate;
