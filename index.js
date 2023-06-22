const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kzrcuv8.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection

    const database = client.db("anivaleDb");
    const carCollection = database.collection("carImageList");

    app.get("/allCars", async (req, res) => {
    
  
        const cursor = carCollection.find()
  
        const result = await cursor.toArray();

        res.send(result)
      })

      app.get("/getCarsByName/:text", async (req, res) => {
        const text = req.params.text;
        const result = await carCollection
          .find({
            $or: [
              { title: { $regex: text, $options: "i" } },
  
            ],
          })
          .toArray();
        res.send(result);
      });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Task server is Running');
  })
  
  app.listen(port, () => {
    console.log(`Task Server is running on port: ${port}`);
  })