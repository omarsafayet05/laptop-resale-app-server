const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Resale-computer is running");
});

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4lrtvjx.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4lrtvjx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const userCollection = client.db("resaleUser").collection("users");
    const computerCollection = client.db("resaleUser").collection("computers");
    //users record
    app.post("/users", async (req, res) => {
      const user = req.body;

      //insert email if user doesn't exist.
      //you can do this in many ways [1.unique email 2.upsert 3.normal checking]

      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "users already exists", insertedId: null });
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    //Get data related laptops
    app.get("/coms", async (req, res) => {
      const result = await computerCollection.find().toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Resale-computer is running on port ${port}`);
});
