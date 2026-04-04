const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/api/hello', (req, res) => {
    res.json({
        message: "Hello Rahul from LOCAL Node API",
        timestamp: new Date()
    });
});

app.get('/api/callazurefn', async (req, res) => {
      try {
        const response = await axios.get(
            'https://expensetrackerfunctionapp-f5fwfygva2h5drcd.centralindia-01.azurewebsites.net/api/httpTrigger1'
        );

        res.json({
            source: "Node API",
            functionResponse: response.data.message
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error calling Azure Function" });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

//https://expensetrackernodeapi-c0f6aqbqf6fncpb7.eastasia-01.azurewebsites.net/api/hello