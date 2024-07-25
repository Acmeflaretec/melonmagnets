const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  validity: {
    type: Date,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  minValue: {
    type: Number,
    required: true
  },
  maxValue: {
    type: Number,
    required: true
  },
  status:{
    type:Boolean,
    default:true
  }
},
{
    timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
