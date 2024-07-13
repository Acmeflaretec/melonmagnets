const { Router } = require('express');
const router = Router();
const authorization = require("../middlewares/authorization");
const { getCoupons,addCoupon,updateCoupon,deleteCoupon,updateCouponStatus,getCouponById } = require('../controllers/couponController');
const { upload } = require('../middlewares/multer');

router.get('/', getCoupons);
 router.get('/:id', getCouponById);
router.post('/',upload.single('image'), addCoupon);
 router.patch('/',upload.single('image'), updateCoupon);
 router.patch('/status/:id', updateCouponStatus);
 router.delete('/:id', deleteCoupon);

module.exports = router;