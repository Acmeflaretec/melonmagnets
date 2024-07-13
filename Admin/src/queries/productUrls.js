import request from "utils/request";

const addCategory = async (data) => request(`/category`, 'POST', data)
const addProduct = async (data) => request(`/products`, 'POST', data)
const updateProduct = async (data) => request(`/products`, 'PATCH', data)
const deleteProduct = async (data) => request(`/products/${data?._id}`, 'DELETE', data)
const getCategory = async (data) => request(`/category?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getCoupon = async (data) => request(`/coupons?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const addCoupon = async (data) => request(`/coupons`, 'POST', data)

const getProducts = async (data) => request(`/products?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getProductById = async (data) => request(`/products/${data?.id}`, 'GET', data)

const couponStatus = async (data) => request(`/coupons/status/${data?._id}`, 'PATCH', data)
const updateCoupon = async (data) => request(`/coupons`, 'PATCH', data)
const getCouponById = async (data) => request(`/coupons/${data?.id}`, 'GET', data)



export {
  addCategory,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategory,
  getProducts,
  getProductById,
  getCoupon,
  addCoupon,
  couponStatus,
  updateCoupon,
  getCouponById,


};
