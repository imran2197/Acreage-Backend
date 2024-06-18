const { MongoClient } = require("mongodb");
const app = require("./controllers/properties");

const conn_str =
  "mongodb+srv://imran251099:imran251099@notescluster.luj719m.mongodb.net/Acreage?retryWrites=true&w=majority&appName=NotesCluster";

const client = new MongoClient(conn_str);
client.connect();

const acreageDB = client.db("Acreage");
module.exports.userCollection = acreageDB.collection("users");
module.exports.trackCollection = acreageDB.collection("trackdata");

app.listen(9999);