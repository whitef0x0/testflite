// In this file you can configure migrate-mongo

module.exports = {
  useMongoDB: true,

  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: "mongodb://db",

    // TODO Change this to your database name:
    databaseName: "bawkbox",

    abCollection: "testflite",

    userCollection: "users"
  },

  previewConfig: {
    showInDevelopment: true,
    showForAdmin: true
  }
};
