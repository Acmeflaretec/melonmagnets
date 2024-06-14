import request from "utils/request";

const addCategory = async (data) => request(`/category`, 'POST', data)
const addProduct = async (data) => request(`/products`, 'POST', data)
const updateProduct = async (data) => request(`/products`, 'PATCH', data)
const deleteProduct = async (data) => request(`/products/${data?.id}`, 'DELETE', data)
const getCategory = async (data) => request(`/category?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getProducts = async (data) => request(`/products?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getProductById = async (data) => request(`/products/${data?.id}`, 'GET', data)

export {
  addCategory,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategory,
  getProducts,
  getProductById
};
