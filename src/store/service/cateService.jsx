import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getToken = (type) => localStorage.getItem(type);

const cateService = createApi({
  reducerPath: "category",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/category",
    prepareHeaders: (headers) => {
      const token = getToken("admin-token") || getToken("user-token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
    getNameCate: builder.query({
      query: ({ id }) => ({
        url: `/name-cate/${id}`,
        method: "GET",
      }),
    }),
    getCategoryChild: builder.query({
      query: () => ({
        url: "/cate-child",
        method: "GET",
      }),
    }),
    getCateLevel12: builder.query({
      query: () => ({
        url: "/catelevel12",
        method: "GET",
      }),
    }),
    getCateLevel123: builder.query({
      query: () => ({
        url: "/catelevel123",
        method: "GET",
      }),
    }),
    getCateLevel3: builder.query({
      query: () => ({
        url: "/catelevel3",
        method: "GET",
      }),
    }),
    getCategories: builder.query({
      query: (queryString) => {
        const queryCate = new URLSearchParams(queryString).toString();
        return {
          url: `/get-categories?${queryCate}`,
          method: "GET",
        };
      },
    }),
    // Endpoint để tạo danh mục mới
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/create",
        method: "POST",
        body: newCategory,
      }),
    }),
    // Endpoint để cập nhật danh mục theo ID
    updateCategory: builder.mutation({
      query: ({ cid, updatedCategory }) => ({
        url: `/update/${cid}`,
        method: "PUT",
        body: updatedCategory,
      }),
    }),
    // Endpoint để xóa danh mục theo ID
    deleteCategory: builder.mutation({
      query: (cid) => ({
        url: `/delete/${cid}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetNameCateQuery,
  useGetCateLevel12Query,
  useGetCateLevel123Query,
  useGetCateLevel3Query,
  useGetCategoryChildQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = cateService;

export default cateService;
