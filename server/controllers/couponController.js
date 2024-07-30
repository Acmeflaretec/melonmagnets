const Coupon = require('../models/coupon')
const User = require('../models/user')

const fs = require('fs');

const getCoupons = async (req, res) => {
  // try {
  //   const { page = 1, limit = 6, sortField, sortOrder, search, category,
  //     priceGreaterThan, priceLessThan, priceMin, priceMax, sortDiscount, sortDiscountGreaterThan } = req.query;


  //   const pageNumber = parseInt(page, 10) || 1;
  //   const limitNumber = parseInt(limit, 10) || 10;

  //   const query = {};


  //   if (search) {
  //     const searchRegex = new RegExp(search, 'i');
  //     query.$or = [
  //       { name: searchRegex },
  //       { brand: searchRegex }

  //     ];
  //   }


  //   if (category) {
  //     query.category = category;
  //   }

  //   // Sorting
  //   const sortOptions = {};
  //   if (sortField && sortOrder) {
  //     sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
  //   }

  //   // Price greater than functionality
  //   if (priceGreaterThan) {
  //     query.sale_rate = { $gt: parseInt(priceGreaterThan) };
  //   }

  //   // Price less than functionality
  //   if (priceLessThan) {
  //     query.sale_rate = { $lt: parseInt(priceLessThan) };
  //   }

  //   // Price range functionality
  //   if (priceMin && priceMax) {
  //     query.sale_rate = { $gte: parseInt(priceMin), $lte: parseInt(priceMax) };
  //   }

  //   if (sortDiscount) {
  //     query.discount = parseInt(sortDiscount);
  //   }

  //   // Sort by discount greater than functionality
  //   if (sortDiscountGreaterThan) {
  //     query.discount = { $gt: parseInt(sortDiscountGreaterThan) };
  //   }

  //   // Find Coupons based on the constructed query
  //   const totalCoupons = await Coupon.countDocuments(query);
  //   const coupons = await Coupon.find(query)
  //     .collation({ locale: 'en' }) // Enable case-insensitive search
  //     .sort(sortOptions)
  //     .skip((pageNumber - 1) * limitNumber)
  //     .limit(limitNumber);
  //   res.status(200).json({ data: coupons })
  // } catch (error) {
  //   console.log(error);
  //   res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  // }


  try {
    const today = new Date();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ data: coupons })
  } catch (error) {
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
};

const addCoupon = async (req, res) => {
  try {
    const { name, validity, discount, minValue, maxValue } = req.body;




    const isExisting = await Coupon.findOne({ name: name });
    if (isExisting) {

      res.status(400).json({ message: "coupon already Exist" });

    } else {
      const newCoupon = new Coupon({
        name,
        validity: new Date(validity),
        discount,
        minValue,
        maxValue,
      });

      const savedCoupon = await newCoupon.save();
      if (savedCoupon) {
        res.status(200).json({ message: "Coupon added successfully!" });
      } else {
        res.status(400).json({ message: "Something went wrong while saving the coupon!" });
      }

    }


  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong!" });
  }
};


const updateCoupon = async (req, res) => {
  const { _id, name, validity, discount, minValue, maxValue } = req.body;

  try {
    const data = await Coupon.findById(_id);
    if (!data) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    await Coupon.updateOne({ _id }, {
      $set: { name, validity: new Date(validity), discount, minValue, maxValue }
    })
    res.status(200).json({ data, message: 'Coupon updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Coupon.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

const updateCouponStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, { status: !status }, { new: true });

    if (updatedCoupon) {
      res.status(200).json({ message: "Coupon status updated successfully", updatedCoupon });
    } else {
      res.status(404).json({ message: "Coupon not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCouponById = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: 'coupon not found' });
    }
    res.status(200).json({ data: coupon });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
}

const getClientCoupons = async (req, res) => {
  try {
    const today = new Date();
    const coupons = await Coupon.find({ status: true, validity: { $gte: today } });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// const validateCoupon = async(req,res) => {
//   const { code } = req.body;
//   try {
//     const coupon = await Coupon.findOne({ code, status: true });
//     if (coupon) {
//       res.json({ valid: true, discount: coupon.discount });
//     } else {
//       res.json({ valid: false, message: 'Invalid or expired coupon.' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }
const validateCoupon = async (req, res) => {
  const { couponId, userId, subtotal } = req.body;
  console.log('couponId, userId, subtotal',couponId, userId, subtotal);  
  const id=userId?._id 
  const coupon = await Coupon.findOne({ _id: couponId, status: true });
  try {
    if (userId) {
      console.log('userid und');
      const user = await User.findById({_id:id});
      console.log("user undonn nokkunnu-",user);
      if (user.coupons.includes(couponId)) {  
        res.json({ valid: false, message: 'This coupon alredy used' });   
      } else {
        if (subtotal < coupon.minValue) {
          res.json({ valid: false, message: `Coupon can be applied only to orders above ${coupon.minValue}` });
        } else {

          res.json({ valid: true, discount: coupon.discount });
        }
      }
    } else {
      if (subtotal < coupon.minValue) {
        res.json({ valid: false, message: `Coupon can be applied only to orders above ${coupon.minValue}` });
      } else {

        res.json({ valid: true, discount: coupon.discount });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

module.exports = {
  getCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
  getCouponById,
  getClientCoupons,
  validateCoupon

}
