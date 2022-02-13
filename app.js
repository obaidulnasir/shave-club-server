const express = require("express");
const app = express();
var cors = require("cors");
require('dotenv').config()

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const email = require("mongodb").email;




// port
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


// mongodb URL 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmbaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

// Client 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('database connect');

        //Database
        const shaveClub = client.db("shave-club");

        //Product Collection
        const product = shaveClub.collection("product");
        //Order Collection
        const orderCollection = shaveClub.collection("orderCollection");
        //Review
        const reviewCollection = shaveClub.collection("reviewCollection");


        //ADD Product API
        app.post('/addProduct', async (req, res) => {
            const addPro = req.body;
            console.log(req.body);
            const result = await product.insertOne(addPro);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send(result);
        });

        //GET All Product
        app.get("/allProduct", async (req, res) => {
            const result = await product.find({}).toArray();
            res.send(result);
        });

        //GET Single product
        app.get("/singleProduct/:id", async (req, res) => {
            const productId = req.params.id;
            const query = { _id: ObjectId(productId) };
            const result = await product.findOne(query);
            res.send(result);
        });

        //Place an order in database
        app.post('/placeOrder', async (req, res) => {
            const orderData = req.body;
            const result = await orderCollection.insertOne(orderData);
            res.send(result);
        });
        //All Order
        app.get("/allOrder", async(req, res)=>{
            const result = await orderCollection.find({}).toArray();
            res.send(result);
        })

        //MY Order
        app.get("/myOrder/:email", async (req, res) => {
            const myAllOrders = req.params.email;
            const query = { email: myAllOrders }
            const result = await orderCollection.find(query).toArray();
            // console.log(result);
            res.send(result);
        });

        //DELETE Single Order
        app.delete('/deleteOrder/:id', async (req, res) => {
            const deleteMyOrder = req.params.id;
            // console.log(deleteMyOrder)
            const query = { _id: ObjectId(deleteMyOrder) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        });
        
        // ADD Review
        app.post("/addReview", async(req, res)=>{
            const addReview = req.body;
            const result = await reviewCollection.insertOne(addReview);
            res.send(result);
        });
        // GET Review 
        app.get("/review", async(req, res)=>{
            const result = await reviewCollection.find({}).toArray();
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);






app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});