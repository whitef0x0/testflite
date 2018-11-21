var util = require('./util');
var _ = require('underscore');
var _db = require('underscore-db');
_.mixin(_db);
var dbfile = 'testflite.tests.json';
var database = null;

/**
 * In-memory database with file persistance
 * Specialized for testflite needs
 */
module.exports = () => {
    if(database){
        return database;
    }
    var db = [];
    var dbExists = util.touch(dbfile, db);
    if (dbExists) {
        db = _.load(dbfile)
    }
    
    var interface = {
        /**
         * Loads all items
         */
        loadAll: () => {
            return db;
        },
        /**
         * Saves new item and returns it
         */
        save: (item) => {
            return _.insert(db, item);
        },
        /**
         * Updates and returns updated item
         */
        update: (item) => {
            if (item && item.id) {
                return _.replaceById(db, item.id, item);
            }
            return null;

        },
        /**
         * Deletes item from the db and returns it
         */
        delete: (item) => {
            if (item && item.id) {
                return _.removeById(db, item.id);
            }
            return null;
        },
        /**
         * Returns item by given template name
         */
        getByTemplate: (template) => {
            return _.detect(db, (item) => {
                return item.page.template == template
            });
        },
        /**
         * Returns item by given destination template name
         */
        getByTestDestination: (template) => {
            var item = _.detect(db, {
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
    }
    
    if(!database){
        database = interface;
    }
    
    return interface;
}