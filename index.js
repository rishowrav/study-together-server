const express = require("express");
require("dotenv").config();
var cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");

// middleWare
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Start MongoDb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sp25joa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const assignmentCollection = client
      .db("studyTogether")
      .collection("assignments");
    const answerCollection = client.db("studyTogether").collection("answers");

    // get assignment single data
    app.get("/assignments/:id", async (req, res) => {
      const id = req.params.id;
      const result = await assignmentCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // get answer
    app.get("/answers", async (req, res) => {
      const result = await answerCollection.find().toArray();
      res.send(result);
    });

    // get assignment
    app.get("/assignments", async (req, res) => {
      const result = await assignmentCollection.find().toArray();
      res.send(result);
    });

    // post answer
    app.post("/answer", async (req, res) => {
      const answer = req.body;

      const result = await answerCollection.insertOne(answer);
      res.send(result);
    });

    // post assignment
    app.post("/assignment", async (req, res) => {
      const assignment = req.body;

      const result = await assignmentCollection.insertOne(assignment);
      res.send(result);
    });

    // patch/update assignment
    app.patch("/assignment/:id", async (req, res) => {
      const assignment = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...assignment,
        },
      };

      const result = await assignmentCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // delete assignment
    app.delete("/assignment/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await assignmentCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// End Mongodb

// online_study_client  epEpar4LRiiCC6CN
app.get("/", (req, res) => {
  res.send("Hello d World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
