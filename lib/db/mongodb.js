const { MongoClient, ObjectId } = require('mongodb');
const _ = require('underscore');

const util = require('../util');
const configFile = require('../env/configFile');

_.mixin({
    get: function(obj, path) {
        if (!obj && !path) {
            return undefined;
        } else {
            var paths;

            if (!_.isEmpty(path.match(/^\[\d\]/))) {
                paths = path.replace(/^[\[\]]/g, '').split(/\./);
                nPath = _.first(paths[0].replace(/\]/, ''));
            } else {
                paths = path.split(/[\.\[]/);
                nPath = _.first(paths);
            }

            remainingPath = _.reduce(_.rest(paths), function(result, item) {
                if (!_.isEmpty(item)) {
                    if (item.match(/^\d\]/)) {
                        item = "[" + item;
                }
                    result.push(item);
                }

                return result;
            }, []).join('.');

            if (_.isEmpty(remainingPath)) {
                return obj[nPath];
            } else {
                return _.has(obj, nPath) && _.get(obj[nPath], remainingPath);
            }
        }
    }
});
/**
 * MongoDB database specialized for testflite needs
 */
const config = configFile.read();
const url = _.get(config, "mongodb.url");
const databaseName = _.get(config, "mongodb.databaseName");
const collectionName = _.get(config, "mongodb.collectionName");

if (!url) {
  throw new Error("No `url` defined in config file!");
}

if (!databaseName) {
  throw new Error(
    "No `databaseName` defined in config file! This is required since migrate-mongo v2. " +
    "See https://github.com/seppevs/migrate-mongo#quickstart"
  );
}
// 
module.exports = (async function(){
  var client = await MongoClient.connect(url);
  const dbCursor = client.db(databaseName).collection(collectionName);
   
  return {
      /**
       * Loads all items
       */
      loadAll: async () => {
          return await dbCursor.find().toArray();
      },
      /**
       * Saves new item and returns it
       */
      save: async (item) => {
          return await dbCursor.insert(item);
      },
      /**
       * Updates and returns updated item
       */
      update: async (item) => {
          return await dbCursor.update({ _id: ObjectId(item._id) }, {$set: item});
      },
      /**
       * Deletes item from the db and returns it
       */
      delete: async (item) => {
          return await dbCursor.remove({ _id: ObjectId(item._id) });
      },
      /**
       * Returns item by given template name
       */
      getByTemplate: async (template) => {
          return await dbCursor.findOne({ 
            "page.template": template
          });
      },

      /**
       * Returns item by given destination template name
       */
      getByTestDestination: async (template) => {
          return await dbCursor.findOne({ destination: template });
      },
      flush: () => {
      },
      reload: () => {
      }
  }
})();