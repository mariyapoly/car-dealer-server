const express = require('express');
const app = express();
var cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ew9gz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("onlineCarDealer");
        const productCollection = database.collection("products");
        const userCollection = database.collection("users");
        const orderCollection = database.collection("orders");

        // get products only ten
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const result = await cursor.limit(8).toArray();
            res.send(result);
        })
        // get all products
        app.get('/allProducts', async (req, res) => {
            const cursor = productCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        // get single product
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);
        })
        // stored user
        app.post('/user', async (req, res) => {
            const query = req.body;
            const result = await userCollection.insertOne(query);
            res.send(result)
        })
        // order saved 
        app.post('/orders', async (req, res) => {
            const query = req.body;
            const result = await orderCollection.insertOne(query);
            console.log(result);
            res.send(result)
        })
        // get order match email
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await orderCollection.find(query).toArray();
            res.send(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('car dealer server running');
})

app.listen(port, () => {
    console.log(`car dealer server running port`, port);
})