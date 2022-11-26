const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//using middleware
app.use(cors());
app.use(express.json());

//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cdvoxlm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client
      .db("serviceReviewDB")
      .collection("services");

    app.get("/", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const servicesHome = await cursor.limit(3).toArray();
      res.send(servicesHome);
    });
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const servicesAll = await cursor.toArray();
      res.send(servicesAll);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

//basic
app.get("/", (req, res) => {
  res.send("service review assignment 11 server running");
});

app.listen(port, () => {
  console.log("service review assignment 11 server running on port ", port);
});
