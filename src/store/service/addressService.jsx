import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Lấy token từ localStorage hoặc từ redux store
const getToken = (type) => localStorage.getItem(type);

const addressService = createApi({
  reducerPath: "address",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/address/", // Thay đổi baseUrl theo API của bạn
    prepareHeaders: (headers) => {
      const token = getToken("admin-token") || getToken("user-token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint để tạo địa chỉ mới
    createAddress: builder.mutation({
      query: (newAddress) => ({
        url: "/create",
        method: "POST",
        body: newAddress,
      }),
    }),
    // Endpoint để lấy tất cả địa chỉ
    getAllAddresses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
    // Endpoint để lấy một địa chỉ theo ID
    getAddressById: builder.query({
      query: (id) => `/get-id/${id}`,
    }),
    // Endpoint để cập nhật địa chỉ theo ID
    updateAddress: builder.mutation({
      query: ({ id, updatedAddress }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: updatedAddress,
      }),
    }),
    // Endpoint để xóa địa chỉ theo ID
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateAddressMutation,
  useGetAllAddressesQuery,
  useGetAddressByIdQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressService;

export default addressService;
