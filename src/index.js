const { MongoClient } = require("mongodb");
const app = require("./controllers/properties");

const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:4200", "https://acreage-properties.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const conn_str =
  "mongodb+srv://imran251099:imran251099@notescluster.luj719m.mongodb.net/Acreage?retryWrites=true&w=majority&appName=NotesCluster";

const client = new MongoClient(conn_str);
client.connect();

const acreageDB = client.db("Acreage");
module.exports.userCollection = acreageDB.collection("users");
module.exports.trackCollection = acreageDB.collection("trackdata");
module.exports.propertyCollection = acreageDB.collection("properties");

app.listen(process.env.PORT || 9999);
