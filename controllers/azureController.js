const axios = require('axios');

// Controller for handling Azure Function calls
exports.callAzureFunction = async (req, res) => {
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
};