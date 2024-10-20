import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Lấy token từ localStorage hoặc từ redux store
const getToken = (type) => localStorage.getItem(type);

const productService = createApi({
  reducerPath: "product",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/product/", // Thay đổi baseUrl theo API của bạn
    prepareHeaders: (headers) => {
      const token = getToken("admin-token") || getToken("user-token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint để lấy tất cả sản phẩm
    getProducts: builder.query({
      query: (queryString) => {
        //đưa vào 1 object trả về một query-string: vd:"page=1&limit=10&sort=price,desc&category=electronics"
        const queryPro = new URLSearchParams(queryString).toString();
        console.log(queryString);
        return {
          url: `/get-products?${queryPro}`,
          method: "GET",
        };
      },
    }),
    getProductOfCategory: builder.query({
      query: (queryString) => {
        //đưa vào 1 object trả về một query-string: vd:"page=1&limit=10&sort=price,desc&category=electronics"
        const queryPro = new URLSearchParams(queryString).toString();
        console.log(queryString);
        return {
          url: `/get-products-category?${queryPro}`,
          method: "GET",
        };
      },
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
        // body: newProduct,
      }),
    }),
    getProductId: builder.query({
      query: ({ pid }) => ({
        url: `/oneproduct/${pid}`,
        method: "GET",
      }),
    }),
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create",
        method: "POST",
        body: newProduct,
      }),
    }),
    // Endpoint để cập nhật sản phẩm theo ID
    updateProduct: builder.mutation({
      query: ({ pid, updatedProduct }) => ({
        url: `/update/${pid}`,
        method: "PUT",
        body: updatedProduct,
      }),
    }),
    // Endpoint để xóa sản phẩm theo ID
    deleteProduct: builder.mutation({
      query: (pid) => ({
        url: `/delete/${pid}`,
        method: "DELETE",
      }),
    }),
    ratings: builder.mutation({
      query: ({ pid, rating }) => ({
        url: `/rating/${pid}`,
        method: "POST",
        body: rating,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductOfCategoryQuery,
  useGetAllProductsQuery,
  useGetProductIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRatingsMutation,
} = productService;

export default productService;
