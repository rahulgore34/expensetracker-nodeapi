const express = require('express');
const { getHello, postHello,sendOtpEmail,verifyOtp,saveExpense,getMyExpenses,getExpenseSummary,getMonthlyExpenseSummary } = require('../controllers/helloController');
const { callAzureFunction } = require('../controllers/azureController');
const authMiddleware =
require("../middleware/authMiddleware");
const categoryMiddleware = require('../middleware/categoryMiddleware');

const router = express.Router();

// Define routes for hello
router.get('/hello', getHello);
router.post('/save', postHello);
router.post('/send-otp', sendOtpEmail);
router.post('/verify-otp', verifyOtp);
router.post('/save-expense',authMiddleware,categoryMiddleware, saveExpense);
router.get('/my-expenses', authMiddleware, getMyExpenses);
router.get('/my-expense-summary', authMiddleware, getExpenseSummary);
router.get('/monthly-expense-summary', authMiddleware, getMonthlyExpenseSummary);
router.get('/callazurefn', callAzureFunction);
module.exports = router;

