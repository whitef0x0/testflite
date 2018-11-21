/*!
 * TestFlite
 * Copyright(c) 2016 Pavlović Dž Filip
 * MIT Licensed
 */

'use strict'

var path = require('path');
var fs = require('fs');
var initRoutes = require('./router');
var stats = require('./stats');

module.exports = {
	stats: stats, 
	initRoutes: initRoutes
};