const { Router } = require('express');
const router = Router();
const { getCartItems, addToCart, updateCartItem, removeFromCart,getReviewOrders } = require('../controllers/cartController');
const { upload } = require('../middlewares/multer');


router.get('/', getCartItems);
router.post('/', upload.array('images', 10), addToCart);
router.patch('/:id', updateCartItem);
router.delete('/:id', removeFromCart);
router.get('/user/:userId/product/:productId', getReviewOrders);


module.exports = router;
