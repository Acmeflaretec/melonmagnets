const Banner = require('../models/banner');

const getBanners = async (req, res) => {
  try {
    const data = await Banner.find()
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
};

const addBanner = async (req, res) => {
  try {
    const { title, subtitle, url, description } = req?.body
    const image = req?.file?.filename
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const data = new Banner({ title, subtitle, url, image, description })
    await data.save()
    res.status(201).json({ data, message: 'banner created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
}

 const getBannerById = async(req,res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json({ data: banner });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
}

const updateBanner = async (req, res) => {
  const { _id, title, subtitle, url, description } = req.body;
  const image = req.file?.filename;
  try {
    const data = await Banner.findById(_id);
    if (!data) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    await Banner.updateOne({ _id }, {
      $set: { title, subtitle, url, description, ...(image && { image }) }
    })
    res.status(200).json({ data, message: 'Banner updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
};

const deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Banner.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    fs.unlink(`public/uploads/${data?.image}`, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
        return;
      }
      console.log('Image deleted successfully.');
    });
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
};

module.exports = {
  getBanners,
  addBanner,
  getBannerById,
  updateBanner,
  deleteBanner
}