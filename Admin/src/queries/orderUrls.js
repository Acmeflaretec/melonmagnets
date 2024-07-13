import request from "utils/request";

const getOrders = async (data) => request(`/orders?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getBulkOrders = async (data) => request(`/orders/bulkorder?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getOrderById = async (data) => request(`/orders/${data?.id}`, 'GET', data)
const getReviewById = async (data) => request(`/reviews/admin/${data?.id}`, 'GET', data)
const editReview = async (data) => request(`/reviews`, 'PATCH', data)
const deleteReview = async (data) => request(`/reviews/${data?._id}`, 'DELETE', data)

export {
  getOrders,
  getOrderById,
  getBulkOrders,
  editReview,
  deleteReview,
  getReviewById
};
