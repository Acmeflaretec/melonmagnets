const Order = require('../models/order')
const BulkOrders = require('../models/bulkOrder')
const Address = require('../models/address')
const CartItem = require('../models/cartItem')
const User = require('../models/user')
// const { sendMail } = require('../utils/mailer')
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');     
const dotenv = require('dotenv');
dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
});






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

// const createOrder = async (req, res) => {
//   const { userId,email, mobile, amount, products, firstname, lastname, country, address_line_1, address_line_2, city, state, zip } = req?.body
//   try {
//     const address = await Address.create({
//       firstname, lastname, country, address_line_1, address_line_2, city, state, zip, mobile,
//     })


//     const data = await Order.create({ userId,email, mobile, amount, address: address._id, products })
//     const productIds = products.map(product => product);
//     // console.log('productIds',productIds);
//     await CartItem.updateMany(   
//       { _id: { $in: products } },
//       { $set: { is_order: true } }
//     );
//     const html = `<h1>Order Received</h1>
//     <br/>New order has been placed by <b>${firstname + " " + lastname}</b>, at ${new Date().toTimeString()} on ${new Date().toDateString()}.
//     <br/>Email : ${email} 
//     <br/>Phone : ${mobile} 
//     <br/>for more details <a href="https://www.admin.melonmagnets.com/#/orders/editOrder/${data?._id}" target="_blank">Click here</a>. 
//     `;
//     await sendMail(html)
//     return res.status(201).json({ data, message: 'Order placed successfully' });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
//   }
// }
const createOrder = async (req, res) => {
  const { userId, email, mobile, amount, products, couponId, firstname, lastname, country, address_line_1, address_line_2, city, state, zip } = req?.body;
  console.log("couponId", couponId);
  try {
    const address = await Address.create({
      firstname, lastname, country, address_line_1, address_line_2, city, state, zip, mobile,
    });

    const order = await Order.create({ userId, email, mobile, amount, address: address._id, products });

    if (couponId) {
      const user = await User.findById(userId);
      if (user.coupons.includes(couponId)) {
        return res.status(400).json({ message: "Coupon already used" });
      }

      user.coupons.push(couponId);
      await user.save();
    }

    await CartItem.updateMany(
      { _id: { $in: products } },
      { $set: { is_order: true,userId } }
    );

    const productDetails = await CartItem.find({ _id: { $in: products } }).populate('productId');

    const orderNumber = order._id;
    const orderTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const adminEmail = process.env.EMAIL_ADMIN;

    const emailSubject = `Your MelonMagnets Order ID is:${orderNumber}`;

    const productItems = productDetails.map(item => `
      <tr>
        <td>${item.productId.name}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
      </tr>
    `).join('');

    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #4CAF50;">Order Received</h1>
        <p>Dear ${firstname} ${lastname},</p>
        <p>Thank you for your order. </p>
        <p>Here are your order details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd;">Product Name</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${productItems}
          </tbody>
        </table>
        <p><strong>Total Amount:</strong> ₹${amount}</p>
        <p><strong>Order Date and Time (IST):</strong> ${orderTime}</p>
        <p>We will notify you once your order is shipped.</p>
        <p>Thank you for shopping with us!</p>
        <p>Best Regards,<br>Melon Magnets</p>
      </div>
    `;

    const internalEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #4CAF50;">Order Received</h1>
        <p>New order has been placed by <b>${firstname} ${lastname}</b> at ${orderTime}.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${mobile}</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd;">Product Name</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${productItems}
          </tbody>
        </table>
        <p><strong>Total Amount:</strong> ₹${amount}</p>
        <p>For more details, <a href="https://www.admin.melonmagnets.com/#/orders/editOrder/${order?._id}" target="_blank">Click here</a>.</p>
      </div>
    `;


    await transporter.sendMail({
      from: process.env.EMAIL_AUTH_USER,
      to: email,
      subject: emailSubject,
      html: customerEmailHtml,
    });


    await transporter.sendMail({
      from: process.env.EMAIL_AUTH_USER,
      to: adminEmail,
      subject: emailSubject,
      html: internalEmailHtml,
    });

    return res.status(201).json({ data: order, message: 'Order placed successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' });
  }
};

// const createBulkOrder = async (req, res) => {
//   const { email, mobile, name, product, quantity, message } = req?.body
//   try {
//     const data = await BulkOrders.create({ email, mobile, name, product, quantity, message })
//     const html = `<h1>Order Received</h1>
//     <br/>New order has been placed by <b>${name}</b>, at ${new Date().toTimeString()} on ${new Date().toDateString()}.
//     <br/>Email : ${email} 
//     <br/>Phone : ${mobile} 
//     <br/>Message : ${message} 
//     <br/><b>Product Details</b>
//     <br/>Product : ${product}
//     <br/>Quantity : ${quantity} 
//     <br/>for more details <a href="https://www.admin.melonmagnets.com/#/bulkorders" target="_blank">Click here</a>. 
//     `;
//     await sendMail(html)
//     return res.status(201).json({ data, message: 'Order placed successfully' });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
//   }
// }


const createBulkOrder = async (req, res) => {
  const { email, mobile, name, product, quantity, message } = req?.body;
  try {
    const data = await BulkOrders.create({ email, mobile, name, product, quantity, message });


    const orderTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const adminEmail = process.env.EMAIL_ADMIN;

    const emailSubject = `Bulk Order received: ${product}`;

    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #4CAF50;">Bulk Order Received</h1>
        <p>Dear ${name},</p>
        <p>Thank you for your bulk order. Here are your order details:</p>
        <ul>
          <li><strong>Product:</strong> ${product}</li>
          <li><strong>Quantity:</strong> ${quantity}</li>
          <li><strong>Message:</strong> ${message}</li>
        </ul>
        <p><strong>Order Date and Time (IST):</strong> ${orderTime}</p>
        <p>We will notify you once your order is processed.</p>
        <p>Thank you for choosing Melon Magnets!</p>
        <p>Best Regards,<br>Melon Magnets</p>
      </div>
    `;

    const internalEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #4CAF50;">Bulk Order Received</h1>
        <p>New bulk order has been placed by <b>${name}</b> at ${orderTime}.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${mobile}</p>
        <ul>
          <li><strong>Product:</strong> ${product}</li>
          <li><strong>Quantity:</strong> ${quantity}</li>
          <li><strong>Message:</strong> ${message}</li>
        </ul>
        <p>For more details, check the admin panel.</p>
      </div>
    `;


    await transporter.sendMail({
      from: process.env.EMAIL_AUTH_USER,
      to: email,
      subject: emailSubject,
      html: customerEmailHtml,
    });


    await transporter.sendMail({
      from: process.env.EMAIL_AUTH_USER,
      to: adminEmail,
      subject: emailSubject,
      html: internalEmailHtml,
    });

    return res.status(201).json({ data, message: 'Bulk order placed successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' });
  }
};

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