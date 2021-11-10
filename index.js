const express = require('express');
const app = express();
var cors = require('cors');
const { MongoClient } = require('mongodb');
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