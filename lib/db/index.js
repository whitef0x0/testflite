const configFile = require('../env/configFile');

/**
 * In-memory database with file persistance
 * Specialized for testflite needs
 */

var config = configFile.read();
if(config.useMongoDB){
    module.exports = require("./mongodb");
} else {
    module.exports = require("./lodash");
}