const { Router } = require('express');
const router = Router();
const { getCartItems, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { upload } = require('../middlewares/multer');


router.get('/', getCartItems);
router.post('/', upload.array('images', 10), addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeFromCart);

module.exports = router;
