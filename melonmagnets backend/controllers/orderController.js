const Order = require('../models/order')
const Address = require('../models/address')

const getOrders = async (req, res) => {
  try {
    const data = await Order.find()
    res.status(200).json({ data })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { _id } = req?.decoded
    const data = await Order.find({ userId: _id })
    res.status(200).json({ data })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
};

const createOrder = async (req, res) => {
  const { email, mobile, amount, products,  firstname, lastname, country, address_line_1, address_line_2, city, state, zip } = req?.body
  try {
    const address = await Address.create({
      firstname, lastname, country, address_line_1, address_line_2, city, state, zip, mobile, 
    })
   
    const data = await Order.create({ email, mobile, amount, address: address._id, products})
    return res.status(201).json({ data, message: 'Order placed successfully' });
   } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
}

const updateOrder = async (req, res) => {
  const { _id, status } = req?.body
  try {
    const data = await Order.updateOne({ _id },
      { $set: { status } })
    res.status(201).json({ data, message: 'Order updated successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
}

module.exports = {
  getOrders,
  getUserOrders,
  createOrder,
  updateOrder,
}