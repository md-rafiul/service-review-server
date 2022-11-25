const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//using middleware
app.use(cors());
app.use(express.json());

//basic
app.get("/", (req, res) => {
  res.send("service review assignment 11 server running");
});

app.listen(port, () => {
  console.log("service review assignment 11 server running on port ", port);
});
