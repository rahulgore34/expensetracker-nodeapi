const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/api/hello', (req, res) => {
    res.json({
        message: "Hello Rahul from Azure Node API",
        timestamp: new Date()
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});