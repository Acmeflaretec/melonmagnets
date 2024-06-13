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
