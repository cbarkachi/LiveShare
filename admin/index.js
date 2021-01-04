var admin = require("firebase-admin");

var serviceAccount = require("./config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://liveshare-291722.firebaseio.com",
});

export default admin;

