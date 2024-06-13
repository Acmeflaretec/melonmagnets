const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  sessionId: {
    type: String,
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
    required: true
  },
  productDetails: {
    type: Array,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CartItem', CartItemSchema);
