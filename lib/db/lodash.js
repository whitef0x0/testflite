var util = require('../util');
var _ = require('underscore');
var _db = require('underscore-db');
_.mixin(_db);
var dbfile = 'testflite.tests.json';

var interface = {};
/**
 * In-memory database with file persistance
 * Specialized for testflite needs
 */

module.exports = (function() {
    var db = [];
    var dbExists = util.touch(dbfile, db);
    if (dbExists) {
        db = _.load(dbfile)
    }
    
    var interface = (async () => {
        return {
            /**
             * Loads all items
             */
            loadAll: async () => {
                return db;
            },
            /**
             * Saves new item and returns it
             */
            save: async (item) => {
                return _.insert(db, item);
            },
            /**
             * Updates and returns updated item
             */
            update: async (item) => {
                if (item && item.id) {
                    return _.replaceById(db, item.id, item);
                }
                return null;
            },
            /**
             * Deletes item from the db and returns it
             */
            delete: async (item) => {
                if (item && item.id) {
                    return _.removeById(db, item.id);
                }
                return null;
            },
            /**
             * Returns item by given template name
             */
            getByTemplate: async (template) => {
                return _.find(db, (item) => {
                    return item.page.template == template
                });
            },

            /**
             * Returns item by given destination template name
             */
            getByTestDestination: async (template) => {
                var item = _.find(db, {
                    destination: template
                });
                return item;
            },
            flush: () => {
                _.save(db, dbfile);
            },
            reload: ()=>{
                db = _.load(dbfile);
            }
        };
    })();
})();