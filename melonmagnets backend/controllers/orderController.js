const Order = require('../models/order')
const Address = require('../models/address')

const getOrders = async (req, res) => {
  try {
    const data = await Order.find()
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { _id } = req?.decoded
    const data = await Order.find({ userId: _id })
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
};

const createOrder = async (req, res) => {
  const { email, phone, payment_mode, amount, products, status, offer, firstname, lastname, country, address_line_1, address_line_2, city, state, zip, mobile, primary } = req?.body
  try {
    const address = await Address.create({
      firstname, lastname, country, address_line_1, address_line_2, city, state, zip, mobile, primary
    })
    if (req?.files?.length != 0) {
    const data = await Order.create({ email, phone, payment_mode, amount, address: address._id, products, status, offer, image: req.files.map((x) => x.filename) })
    return res.status(201).json({ data, message: 'Order placed successfully' });
    }
    return res.status(400).json({ message: "Something went wrong !" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
}

const updateOrder = async (req, res) => {
  const { _id, status } = req?.body
  try {
    const data = await Order.updateOne({ _id },
      { $set: { status } })
    res.status(201).json({ data, message: 'Order updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
}

module.exports = {
  getOrders,
  getUserOrders,
  createOrder,
  updateOrder,
}