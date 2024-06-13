// controllers/cartController.js
const CartItem = require('../models/cartItem');

// Get all cart items for a specific session
exports.getCartItems = async (req, res) => {
  const { sessionId } = req.query; // Assuming session ID is passed as a query parameter
  try {
    const cartItems = await CartItem.find({ sessionId }).populate('productId');
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Add a new item to the cart
exports.addToCart = async (req, res) => {
  const { sessionId, productId, quantity, price, image, productDetails } = req.body;
  console.log(sessionId, productId, quantity, price, image, productDetails);
  try {
    const cartItem = new CartItem({
      sessionId,
      productId,
      quantity,
      price,
      image: req.files.map((x) => x.filename),
      productDetails
    });

    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update quantity of a cart item
exports.updateCartItem = async (req, res) => {
  const { sessionId, itemId } = req.params;
  const { quantity } = req.body;
  try {
    const cartItem = await CartItem.findOneAndUpdate(
      { _id: itemId, sessionId },
      { quantity },
      { new: true }
    );
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
  const { sessionId, itemId } = req.params;
  try {
    await CartItem.findOneAndRemove({ _id: itemId, sessionId });
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
