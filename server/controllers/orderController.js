const Order = require('../models/order')
const BulkOrders = require('../models/bulkOrder')
const Address = require('../models/address')
const CartItem = require('../models/cartItem')
const { sendMail } = require('../utils/mailer')

const getOrders = async (req, res) => {
  try {
    console.log('poi');
    const data = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ data })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
};

const getBulkOrders = async (req, res) => {
  try {
    const data = await BulkOrders.find().sort({ createdAt: -1 });
    res.status(200).json({ data })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req?.params
    const data = await Order.findOne({ _id: id })
      .populate('address')
      .populate({
        path: 'products',
        populate: {
          path: 'productId',
          model: 'Product'
        }
      });
    res.status(200).json({ data })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
};

const createOrder = async (req, res) => {
  const { userId,email, mobile, amount, products, firstname, lastname, country, address_line_1, address_line_2, city, state, zip } = req?.body
  try {
    const address = await Address.create({
      firstname, lastname, country, address_line_1, address_line_2, city, state, zip, mobile,
    })
    

    const data = await Order.create({ userId,email, mobile, amount, address: address._id, products })
    const productIds = products.map(product => product);
    // console.log('productIds',productIds);
    await CartItem.updateMany(   
      { _id: { $in: products } },
      { $set: { is_order: true } }
    );
    const html = `<h1>Order Received</h1>
    <br/>New order has been placed by <b>${firstname + " " + lastname}</b>, at ${new Date().toTimeString()} on ${new Date().toDateString()}.
    <br/>Email : ${email} 
    <br/>Phone : ${mobile} 
    <br/>for more details <a href="https://www.admin.melonmagnets.com/#/orders/editOrder/${data?._id}" target="_blank">Click here</a>. 
    `;
    await sendMail(html)
    return res.status(201).json({ data, message: 'Order placed successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
}

const createBulkOrder = async (req, res) => {
  const { email, mobile, name, product, quantity, message } = req?.body
  try {
    const data = await BulkOrders.create({ email, mobile, name, product, quantity, message })
    const html = `<h1>Order Received</h1>
    <br/>New order has been placed by <b>${name}</b>, at ${new Date().toTimeString()} on ${new Date().toDateString()}.
    <br/>Email : ${email} 
    <br/>Phone : ${mobile} 
    <br/>Message : ${message} 
    <br/><b>Product Details</b>
    <br/>Product : ${product}
    <br/>Quantity : ${quantity} 
    <br/>for more details <a href="https://www.admin.melonmagnets.com/#/bulkorders" target="_blank">Click here</a>. 
    `;
    await sendMail(html)
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
  getBulkOrders,
  getOrderById,
  createOrder,
  createBulkOrder,
  updateOrder,
}