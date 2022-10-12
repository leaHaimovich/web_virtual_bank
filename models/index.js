const debug = require("debug")("mongo:model");
const mongo = require("mongoose");
//mongo.Promise = Promise;

//let db = mongo.createConnection('mongodb://localhost:27017/lab-mongo-5778', { useMongoClient: true });
//db.then(() => debug("Connected to DB"));
//db.catch(err => debug("Error connecting to DB: " + err));
let db = mongo.createConnection();
(async () => {
    try {
        await db.openUri('mongodb://localhost/lab-mongo-5778');
    } catch (err) {
        debug("Error connecting to DB: " + err);
    }
})();
debug('Pending DB connection');

require("./client")(db);
require("./manager")(db);
 require("./loan")(db);
 require("./levCoin")(db);
 require("./transfers")(db);

module.exports = model => db.model(model);
