const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mobile: {
        type:Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: mongoose.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    products: [{
        type: mongoose.Types.ObjectId,
        ref: 'CartItem',
        required: true
    }],
    status: {
        type: String,
        enum: ["Pending", "Placed", "Shipped", "Out_of_delivery", "Delivered", "Delayed", "Canceled"],
        default: "Placed"
    },
    offer: {
        type: String,
        default: "None"
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Orders', orderSchema)