const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const categoryRoutes = require('./categoryRoutes');
const addressRoutes = require('./addressRoutes');
const bannerRoutes = require('./bannerRoutes');
const cartRoutes = require('./cartRoutes')
const couponRoutes = require('./couponRoutes')
const reviewRoutes = require('./reviewRoutes')
const router = express.Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/category', categoryRoutes);
router.use('/v1/products', productRoutes);    
router.use('/v1/orders', orderRoutes);
router.use('/v1/address', addressRoutes);
router.use('/v1/banner', bannerRoutes);
router.use('/v1/cart', cartRoutes);
router.use('/v1/coupons', couponRoutes);
router.use('/v1/reviews', reviewRoutes);


module.exports = router;
