import { ServerURL } from "./baseUrl";
import { commonApi } from "./commonapi"


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

export const getCartItemApi = async (id)=>{
    return await commonApi('GET', `${ServerURL}/api/v1/cart?${id}`)
}
export const updateCartItemApi = async (id , quantity)=>{
    return await commonApi('PATCH', `${ServerURL}/api/v1/cart/${id}?qty=${quantity}`)
}

export const removeCartItemApi = async (id)=>{
    return await commonApi('DELETE',`${ServerURL}/api/v1/cart/${id}`)
}