const { Router } = require('express');
const router = Router();
const authorization = require("../middlewares/authorization");
const { getBanners, addBanner, updateBanner, deleteBanner, getBannerById } = require('../controllers/bannerController');

router.get('/', getBanners);
router.get('/:id', getBannerById);
router.post('/', authorization, addBanner);
router.patch('/',authorization, updateBanner);
router.delete('/:id', authorization, deleteBanner);

module.exports = router;
