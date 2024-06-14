import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addCategory,
  addProduct,
  deleteProduct,
  getCategory,
  getProductById,
  getProducts,
  updateProduct,
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

export {
  useGetCategory,
  useGetProducts,
  useGetProductById,
  useAddCategory,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct
};
