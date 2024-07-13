const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: Array,
  },
  is_order:{
    type: Boolean,
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('CartItem', CartItemSchema);
