const fs = require("fs");
const path = require("path");

const DEFAULT_CONFIG_FILE_NAME = "testflite.config.js";

function getConfigPath() {
  const fileOptionValue = path.join(process.cwd(), DEFAULT_CONFIG_FILE_NAME);
  if(global.options && global.options.hasOwnProperty("file")){
    file = global.options.file;
  }

  if (path.isAbsolute(fileOptionValue)) {
    return fileOptionValue;
  }
  return path.join(process.cwd(), fileOptionValue);
}

module.exports = {
  DEFAULT_CONFIG_FILE_NAME,

  async shouldExist() {
    const configPath = getConfigPath();
    try {
      await fs.stat(configPath);
    } catch (err) {
      throw new Error(`config file does not exist: ${configPath}`);
    }
  },

  getConfigFilename() {
    return path.basename(getConfigPath());
  },

  read() {
    return require(getConfigPath()); // eslint-disable-line
  }
};