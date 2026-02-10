const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
    agentName: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    numberOfSales: {
        type: Number,
        required: true,
        min: 1,
    },
}, { timestamps: true });

salesSchema.index({ agentName: 1 });

module.exports = mongoose.model("Sales", salesSchema);
