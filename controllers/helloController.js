const User = require('../models/User');
const sendOtpEmail = require('../utils/sendOtpEmail');
const generateToken = require("../utils/generateToken");
const Expense = require("../models/Expense");
// Controller for handling hello-related logic

exports.getHello = (req, res) => {
    res.json({
        message: "Hello Rahul from LOCAL Node API",
        timestamp: new Date()
    });
};

exports.postHello = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const user = await User.create({ email });

        res.status(201).json({
            message: 'User saved successfully',
            user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sendOtpEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        let message = '';
        if (!user) {
            user = await User.create({ email: normalizedEmail });
            message = 'User created successfully';
        } else {
            message = 'User already exists';
        }
        // Cooldown check: only allow sending a new OTP if the last OTP was sent more than 1 minute ago.
        // This prevents spamming the email service and gives the user time to use the current OTP.
        const now = Date.now();
        if (user.otpSentAt && now - user.otpSentAt.getTime() < 60 * 1000) {
            return res.status(429).json({
                message: "Please wait before requesting another OTP"
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        user.otpSentAt = new Date();
        await user.save();
        await sendOtpEmail(normalizedEmail, otp);
        res.status(201).json({
            message: message + ' and OTP sent successfully',
            email: normalizedEmail,
            otpExpiry: user.otpExpiry
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ error: 'Email not found' });
        }
        if (user.otp !== parseInt(otp)) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ error: 'OTP has expired' });
        }
        user.isOtpVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        // 🔥 Generate JWT
        const token = generateToken(user);
        res.status(200).json({
            token,
            message: 'OTP verified successfully',
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.saveExpense = async (req, res) => {
    try {
        const {
            expenseName,
            amount,
            paidFrom,
            date
        } = req.body;

        // user comes from JWT middleware
        const userId = req.user.userId;
        const expense = await Expense.create({
            userId,
            expenseName,
            amount,
            paidFrom,
            date,
            category: req.category
        });
        res.status(201).json({
            message: "Expense saved successfully",
            data: expense,
            statusCode: 201
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }

};

exports.getMyExpenses = async (req, res) => {
    try {
        // userId from JWT middleware
        const userId = req.user.userId;

        const expenses = await Expense.find({
            userId
        }).sort({ date: -1 });

        res.status(200).json({
            statusCode: 200,
            count: expenses.length,
            data: expenses
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

