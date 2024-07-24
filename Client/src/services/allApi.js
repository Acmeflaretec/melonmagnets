import { ServerURL } from "./baseUrl";
import { commonApi } from "./commonapi"
import axios from "axios"



export const getallproductsapi = async()=>{
    return await commonApi('GET',`${ServerURL}/api/v1/products`);
}
export const getAllCategoryApi = async()=>{
    return await commonApi('GET',`${ServerURL}/api/v1/category`);
}
export const addToCartApi = async (reqBody ,reqHeader) => {  
    return await commonApi('POST', `${ServerURL}/api/v1/cart`, reqBody, reqHeader);
  };

  export const getallproductsByIdapi = async(id)=>{
    return await commonApi('GET',`${ServerURL}/api/v1/products/${id}`);
}

  export const addOrderApi = async(reqBody )=>{
   return await commonApi('POST',`${ServerURL}/api/v1/orders`,reqBody)
 }
  export const createBulkOrderApi = async(reqBody )=>{
   return await commonApi('POST',`${ServerURL}/api/v1/orders/bulkorder`,reqBody)
 }

export const getCartItemApi = async (id)=>{
    return await commonApi('GET', `${ServerURL}/api/v1/cart?${id}`)
}
export const updateCartItemApi = async (id , quantity)=>{
    return await commonApi('PATCH', `${ServerURL}/api/v1/cart/${id}?qty=${quantity}`)
}

export const removeCartItemApi = async (id)=>{
    return await commonApi('DELETE',`${ServerURL}/api/v1/cart/${id}`)
}




export const getCouponsApi = async () => {
  try {
    const response = await axios.get(`${ServerURL}/api/v1/coupons/client`);
    return response;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return { status: 500, data: [] };
  }
};

export const validateCouponApi = async (couponId,userId,subtotal) => {
  try {
    const response = await axios.post(`${ServerURL}/api/v1/coupons/validate-coupon`, { couponId,userId,subtotal });
    return response;
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { status: 400, data: { valid: false, message: 'Error validating coupon.' } };
  }
};