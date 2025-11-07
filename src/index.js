const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const authRoutes = require("./Routes/authRoutes");
const propertyRoutes = require("./Routes/propertyRoutes");
const s3BucketRoutes = require("./Routes/s3BucketRoutes");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://acreage-properties.netlify.app",
      "https://acreage.vercel.app",
      "*",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const conn_str =
  "mongodb+srv://imran251099:imran251099@notescluster.luj719m.mongodb.net/Acreage?retryWrites=true&w=majority&appName=NotesCluster";

const client = new MongoClient(conn_str);
client.connect();
const acreageDB = client.db("Acreage");

// Collections
module.exports.userCollection = acreageDB.collection("users");
module.exports.trackCollection = acreageDB.collection("trackdata");
module.exports.propertyCollection = acreageDB.collection("properties");

// Routes
app.use("/auth", authRoutes);
app.use("/acreage", propertyRoutes);
app.use("/acreage", s3BucketRoutes);

app.listen(process.env.PORT || 9999);

export default app;
