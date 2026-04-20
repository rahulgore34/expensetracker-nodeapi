const User = require('../models/User');
const sendOtpEmail = require('../utils/sendOtpEmail');

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
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (!existingUser) {
            return res.status(404).json({ error: 'Email not added yet' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        await User.updateOne(
            { email },
            {
                otp,
                otpExpiry: new Date(Date.now() + 5 * 60 * 1000)
            }
        );
        await sendOtpEmail(normalizedEmail, otp);
        res.status(201).json({
            message: 'OTP sent successfully',
            email: normalizedEmail
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
        res.json({
            message: 'OTP verified successfully',
            email: normalizedEmail
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
