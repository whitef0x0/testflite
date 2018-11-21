/*!
 * TestFlite
 * Copyright(c) 2018 Arielle Baldwynn
 * MIT Licensed
 */

'use strict'

const setupAdmin = require('./lib/router');
const stats = require('./lib/stats');

module.exports = {
	stats: stats, 
	setupAdmin: setupAdmin
};