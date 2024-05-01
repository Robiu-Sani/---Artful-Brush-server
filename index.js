const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

async function connectToDatabase() {
  const uri = `mongodb+srv://${process.env.VITE_USER}:${process.env.VITE_PASSWORD}@cluster0.rlif5vj.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  return client.db("craftDB").collection("craft");
}

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", (req, res) => {
  res.send("Is code pushing?");
});

app.get("/addCraft", async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const cursor = collection.find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching crafts:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/addCraft/:id", async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await collection.findOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error fetching craft by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/addCraft/:id", async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const id = req.params.id;
    const craft = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };

    const updatedCraft = {
      $set: {
        user_name: craft.user_name,
        user_image: craft.user_image,
        user_email: craft.user_email,
        item_name: craft.item_name,
        category_Name: craft.category_Name,
        subcategory_Name: craft.subcategory_Name,
        short_title: craft.short_title,
        item_image_url: craft.item_image_url,
        item_prise: craft.item_prise,
        item_rating: craft.item_rating,
        processing_time: craft.processing_time,
        short_description: craft.short_description,
        customization: craft.customization,
        stock_status: craft.stock_status,
      },
    };

    const result = await collection.updateOne(filter, updatedCraft, options);
    res.send(result);
  } catch (error) {
    console.error("Error updating craft:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/addCraft", async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const craft = req.body;
    const result = await collection.insertOne(craft);
    res.send(result);
  } catch (error) {
    console.error("Error adding craft:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/addCraft/:id", async (req, res) => {
  try {
    const collection = await connectToDatabase();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await collection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error deleting craft:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = app; // Export your Express app

// Set up the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}
