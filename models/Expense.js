const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    expenseName: {
        type: String,
        required: true,
        trim: true
    },

    amount: {
        type: Number,
        required: true
    },

    paidFrom: {
        type: String,
        enum: ['UPI', 'Cash', 'Card', 'Bank Transfer','Amazon Paylater'],
        required: true
    },
    category: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Expense", expenseSchema);