const express = require('express');
const { getHello, postHello,sendOtpEmail,verifyOtp } = require('../controllers/helloController');
const { callAzureFunction } = require('../controllers/azureController');


const router = express.Router();

// Define routes for hello
router.get('/hello', getHello);
router.post('/save', postHello);
router.post('/send-otp', sendOtpEmail);
router.post('/verify-otp', verifyOtp);
router.get('/callazurefn', callAzureFunction);
module.exports = router;

