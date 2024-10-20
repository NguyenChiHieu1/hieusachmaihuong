import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Lấy token từ localStorage hoặc từ redux store
const getToken = (type) => localStorage.getItem(type);

const brandService = createApi({
  reducerPath: "brand",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/brand/", // Thay đổi baseUrl theo API của bạn
    prepareHeaders: (headers) => {
      const token = getToken("admin-token") || getToken("user-token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint để tạo thương hiệu mới
    createBrand: builder.mutation({
      query: (newBrand) => ({
        url: "create",
        method: "POST",
        body: newBrand,
      }),
    }),
    // Endpoint để lấy một thương hiệu theo ID
    getBrandById: builder.query({
      query: (bid) => ({
        url: `${bid}`,
        method: "GET",
      }),
    }),
    // Endpoint để lấy tất cả thương hiệu
    getAllBrands: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
    getBrands: builder.query({
      query: (queryString) => {
        //đưa vào 1 object trả về một query-string: vd:"page=1&limit=10&sort=price,desc&category=electronics"
        const queryPro = new URLSearchParams(queryString).toString();
        return {
          url: `/get-brand?${queryPro}`,
          method: "GET",
        };
      },
    }),

    // Endpoint để cập nhật một thương hiệu theo ID
    updateBrand: builder.mutation({
      query: ({ id, updatedBrand }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: updatedBrand,
      }),
    }),
    // Endpoint để xóa một thương hiệu theo ID
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateBrandMutation,
  useGetAllBrandsQuery,
  useGetBrandByIdQuery,
  useGetBrandsQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandService;

export default brandService;
