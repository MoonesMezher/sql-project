require("dotenv").config()

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

let connection;

// Middleware
app.use(express.json());


const productsRouter = require('./routes/products.routes');
const { db } = require("./database");

// Routes
app.use('/api/products', productsRouter)

// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    db();
});

module.exports= connection;
