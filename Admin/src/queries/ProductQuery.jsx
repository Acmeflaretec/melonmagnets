import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addCategory,
  addProduct,
  deleteProduct,
  getCategory,
  getProductById,
  getProducts,
  updateProduct,
  
  getCoupon,
  getCouponById,
  addCoupon,
  updateCoupon,
  deletecoupons,
  couponStatus,
  getReview,
} from "./productUrls";



const useGetCategory = (data) => {
  return useQuery(["get_category", data], () => getCategory(data), {
    staleTime: 3000,
    keepPreviousData: true,
    // refetchOnWindowFocus: false,
  });
};

const useGetProducts = (data) => {
  return useQuery(["get_products", data], () => getProducts(data), {
    // staleTime: 30000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};

const useGetProductById = (data) => {
  return useQuery(["get_products", data], () => getProductById(data), {
    // staleTime: 30000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};


const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => addCategory(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_category");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};


const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => addProduct(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_products");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};
const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => updateProduct(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_products");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};



const useGetCoupon = (data) => {
  return useQuery(["get_category", data], () => getCoupon(data), {
    staleTime: 3000,
    keepPreviousData: true,
    // refetchOnWindowFocus: false,
  });
};

const useAddCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => addCoupon(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_coupon");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};
const useGetCouponById = (data) => {
  console.log('get coupon by id', data)
  return useQuery(["get_coupons", data], () => getCouponById(data), {
    // staleTime: 30000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
const useUpdateCouponStatus = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => couponStatus(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_coupons");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};

const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => updateCoupon(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_coupons");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};
const useDeletecoupons = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => deletecoupons(data), {


    onSuccess: (data) => {
      queryClient.invalidateQueries("get_coupons");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};

const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => deleteProduct(data), {


    onSuccess: (data) => {
      queryClient.invalidateQueries("get_products");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};


const useGetReview = (data) => {
  return useQuery(["get_products", data], () => getReview(data), {
    // staleTime: 30000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};

export {
  useGetCategory,
  useGetProducts,
  useGetProductById,
  useAddCategory,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
  useGetCoupon,
  useGetCouponById,
  useAddCoupon,
  useUpdateCouponStatus,
  useUpdateCoupon,
  useGetReview,
  useDeletecoupons
};
