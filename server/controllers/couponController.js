const Coupon = require('../models/coupon')
const fs = require('fs');

const getCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 6, sortField, sortOrder, search, category,
      priceGreaterThan, priceLessThan, priceMin, priceMax, sortDiscount, sortDiscountGreaterThan } = req.query;

    
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const query = {};

    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex }
       
      ];
    }

   
    if (category) {
      query.category = category;
    }

    // Sorting
    const sortOptions = {};
    if (sortField && sortOrder) {
      sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
    }

    // Price greater than functionality
    if (priceGreaterThan) {
      query.sale_rate = { $gt: parseInt(priceGreaterThan) };
    }

    // Price less than functionality
    if (priceLessThan) {
      query.sale_rate = { $lt: parseInt(priceLessThan) };
    }

    // Price range functionality
    if (priceMin && priceMax) {
      query.sale_rate = { $gte: parseInt(priceMin), $lte: parseInt(priceMax) };
    }

    if (sortDiscount) {
      query.discount = parseInt(sortDiscount);
    }

    // Sort by discount greater than functionality
    if (sortDiscountGreaterThan) {
      query.discount = { $gt: parseInt(sortDiscountGreaterThan) };
    }

    // Find Coupons based on the constructed query
    const totalCoupons = await Coupon.countDocuments(query);
    const coupons = await Coupon.find(query)
      .collation({ locale: 'en' }) // Enable case-insensitive search
      .sort(sortOptions)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
    res.status(200).json({ data:coupons })
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
};

const addCoupon = async (req, res) => {
  try {
    const { name, description, validity, discount,code } = req.body;
    
       
      const image = req?.file?.filename

const isExisting =await Coupon.findOne({code:code});
console.log('is exi',isExisting)
if(isExisting){

  res.status(400).json({ message: "coupon already Exist" });

}else{
  const newCoupon = new Coupon({
    name,
    description,
    validity: new Date(validity),  
    discount,
    code,
    image: image
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
  const { _id, name, description, validity, discount } = req.body;

  console.log(req.body)

  const image = req?.file?.filename;
  try {
    const data = await Coupon.findById(_id);
    if (!data) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    if (image) {
      fs.unlink(`public/uploads/${data?.image}`, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
          return;
        }
        console.log('Image deleted successfully.');
      });
    }
    await Coupon.updateOne({ _id }, {
      $set: { name, description, validity:new Date(validity), discount, ...(image && { image }) }
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
    fs.unlink(`public/uploads/${data?.image}`, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
        return;
      }
      console.log('Image deleted successfully.');
    });
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
      const updatedCoupon = await Coupon.findByIdAndUpdate(id, { status:!status }, { new: true });

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

const getCouponById = async(req,res) => {
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

module.exports={
  getCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
  getCouponById,

}
