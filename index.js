const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.b6ihxc4.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function run() {
  try {
    
    await client.connect();
    
    const db = client.db("momentumDB");
    const eventCollections = db.collection("events")

    // get all Events API
    app.get("/events", async(req, res) =>{
        const result = await eventCollections.find().toArray();
        res.send(result)
    })

    // get latest Events api
    app.get("/events/latest", async(req, res)=>{
      const result = await eventCollections.find().sort({date: -1}).limit(3).toArray();
        res.send(result)
    })

    // get a Event by id
    app.get("/events/:id", async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await eventCollections.findOne(query);
      res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log(
      "---------------------Pinged your deployment. You successfully connected to MongoDB!----------------------"
    );
  } finally {
   
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
