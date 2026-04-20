const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        isOtpVerified: {
            type: Boolean,
            default: false
        },
        otp: {
            type: Number
        },
        otpExpiry: {
            type: Date
        }
    },
    {
        timestamps: true,
        collection: 'users'
    }
);

module.exports = mongoose.model('User', userSchema);
