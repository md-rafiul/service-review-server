const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
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

function varifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log(authHeader);
  if (!authHeader) {
    res.status(401).send({ message: "unauthorize access" });
  }
  const token = authHeader.split(" ")[1];

  console.log(token);
  jwt.verify(token, process.env.JWT_TOKEN_SECRET, function (err, decoded) {
    console.log("in vary: ", decoded);
    if (err) {
      res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const serviceCollection = client
      .db("serviceReviewDB")
      .collection("services");
    const feedbacksCollection = client
      .db("serviceReviewDB")
      .collection("feedbacks");

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_TOKEN_SECRET, {
        expiresIn: "10h",
      });
      res.send({ token });
    });

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

    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    //feedbacks
    app.get("/feedbacks", varifyJWT, async (req, res) => {
      // console.log(req.url.split("=")[1]);
      const email = req.headers.authorization.split(" ")[2];
      const decoded = req.decoded;
      console.log(decoded);
      if (decoded.email !== (req.query.userEmail || email)) {
        res.status(403).send({ message: "unauthorize access email" });
      }

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
      const feedback = req.body;
      const result = await feedbacksCollection.insertOne(feedback);
      res.send(result);
    });

    app.delete("/feedbacks/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await feedbacksCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/feedbacks/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          status,
        },
      };
      const result = await feedbacksCollection.updateOne(query, updatedDoc);
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
