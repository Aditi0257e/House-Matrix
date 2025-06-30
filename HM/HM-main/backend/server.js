const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyparser.json());
app.use(cors());
app.use(express.json());
dotenv.config();

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "ARAPP";
let db;
client
  .connect()
  .then(() => {
    console.log("MongoDB connected");
    db = client.db(dbName);
  })
  .catch((err) => console.error(err));

// console.log(process.env.MONGO_URI) // remove this after you've confirmed it is working
//get all passwords

// API for users
app.post("/signup", async(req, res) => {
  // console.log(req)
  const password = req.body;
  const collection = db.collection('passwords');
  const findResult = await collection.insertOne(password);
  res.send({success: true})
})

app.get("/login/:email", async(req, res) => {
  console.log(req.params.email);
  const email = req.params.email;
  console.log(email);
  const collection = db.collection('passwords');
  const findResult = await collection.findOne({email});
  res.send(findResult);
})

// API for items
app.get("/gggg", async (req, res) => {
  const collection = db.collection("items");
  const findResult = await collection.find({}).toArray();
  res.send(findResult);
});

// API for items
app.get("/items", async (req, res) => {
  const collection = db.collection("items");
  const findResult = await collection.find({}).toArray();
  res.send(findResult);
});

// API for furnitures
app.get("/furnitures", async (req, res) => {
  const collection = db.collection("furnitures");
  const findResult = await collection.find({}).toArray();
  res.send(findResult);
});

// API for varients
app.get("/variants", async (req, res) => {
  const collection = db.collection("variants");
  const findResult = await collection.find({}).toArray();
  res.send(findResult);
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
