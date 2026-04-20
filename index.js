const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const helloRoutes = require('./routes/helloRoutes');
const connectDB = require('./config/db');

const app = express();

app.use(cors());

// Add middleware to parse JSON requests
app.use(express.json());

// Use routes
app.use('/api', helloRoutes);

// Middleware for handling 404 - invalid paths
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

const port = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB()

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();

//https://expensetrackernodeapi-c0f6aqbqf6fncpb7.eastasia-01.azurewebsites.net/api/hello
