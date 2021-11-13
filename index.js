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
        const reviewCollection = database.collection("customerReview");

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
        // delete  product 
        app.delete('/allProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })
        // added a product
        app.post('/addProduct', async (req, res) => {
            const query = req.body;
            const result = await productCollection.insertOne(query);
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
            res.send(result)
        })
        // get all orders
        app.get('/allorders', async (req, res) => {
            const cursor = orderCollection.find({})
            const result = await cursor.toArray();
            res.send(result)
        })
        // get order match email
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await orderCollection.find(query).toArray();
            res.send(result)
        })

        // delete order product
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })
        // update product status
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'shipped'
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        // get customer reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({})
            const result = await cursor.toArray();
            res.send(result)
        })
        // post customer review 
        app.post('/review', async (req, res) => {
            const query = req.body;
            const result = await reviewCollection.insertOne(query);
            res.send(result)
        })


        // get user admin role
        app.get('/makeAdmin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result)

        })


        // set user role admin
        app.put('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            if (query) {
                const updateDoc = {
                    $set: {
                        role: "admin"
                    }
                }
                const result = await userCollection.updateOne(query, updateDoc);
                res.send(result);
            }
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