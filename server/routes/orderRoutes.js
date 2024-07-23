const { Router } = require('express');
const router = Router();
const authorization = require("../middlewares/authorization");
const { getOrders, getOrderById, createOrder, updateOrder, createBulkOrder, getBulkOrders } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.post('/bulkorder', createBulkOrder);
router.get('/bulkorder', getBulkOrders);
router.get('/:id', getOrderById);
router.patch('/', updateOrder);


module.exports = router;
