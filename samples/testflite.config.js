// In this file you can configure migrate-mongo

module.exports = {
  useMongoDB: true,

  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: "your_db",

    // TODO Change this to your database name:
    databaseName: "your_dbname",

    abCollection: "testflite"
  },

  overlay: {
    //Set this to true overlay when process.env.NODE_ENV is 'development'
    showInDevelopment: true,

    admin: {
      //Set this to true to show overlay when admin user is logged in
      show: true,

      //Set this to the admin flag in the user object (i.e. req.session.user.admin)
      userFlag: 'admin'
    }
  }
};
