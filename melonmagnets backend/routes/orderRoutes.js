const { Router } = require('express');
const router = Router();
const authorization = require("../middlewares/authorization");
const { getOrders, getOrderById, createOrder, updateOrder } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', authorization, getOrders);
router.get('/:id', authorization, getOrderById);
router.patch('/',authorization, updateOrder);

module.exports = router;
