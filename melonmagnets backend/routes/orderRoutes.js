const { Router } = require('express');
const router = Router();
const authorization = require("../middlewares/authorization");
const { getOrders, getUserOrders, createOrder, updateOrder } = require('../controllers/orderController');
const { upload } = require('../middlewares/multer');

router.post('/', upload.array('images', 10), createOrder);
router.get('/', authorization, getOrders);
router.get('/:id', authorization, getUserOrders);
router.patch('/',authorization, updateOrder);

module.exports = router;
