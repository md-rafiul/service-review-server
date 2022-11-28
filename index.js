const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//using middleware
app.use(cors());
app.use(express.json());

//mongodb connection
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
    const userCollection = client.db("serviceReviewDB").collection("users");
    const feedbacksCollection = client
      .db("serviceReviewDB")
      .collection("feedbacks");

    // home services
    app.get("/", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const servicesHome = await cursor.limit(3).toArray();
      res.send(servicesHome);
    });

    //all services
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const servicesAll = await cursor.toArray();
      res.send(servicesAll);
    });

    //service by id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //feedbacks
    app.get("/feedbacks", async (req, res) => {
      let query = {};
      if (req.query.userEmail) {
        query = {
          userEmail: req.query.userEmail,
        };
      }
      if (req.query.productId) {
        query = {
          productId: req.query.productId,
        };
      }
      const cursor = feedbacksCollection.find(query);
      const feedbacks = await cursor.toArray();
      res.send(feedbacks);
    });

    app.post("/feedbacks", async (req, res) => {
      const order = req.body;
      const result = await feedbacksCollection.insertOne(order);
      res.send(result);
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
