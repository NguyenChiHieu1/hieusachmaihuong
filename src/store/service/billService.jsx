import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to get token from localStorage
const getToken = (type) => localStorage.getItem(type);

// Define API slice
const billService = createApi({
  reducerPath: "billService",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/bill/", // Adjust base URL according to your backend
    prepareHeaders: (headers) => {
      // Determine token type based on the endpoint
      const token = getToken("admin-token") || getToken("user-token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createBill: builder.mutation({
      query: (billData) => ({
        url: "create",
        method: "POST",
        body: billData,
      }),
    }),
    getBills: builder.query({
      query: (queryString) => {
        const queryPro = new URLSearchParams(queryString).toString();
        return {
          url: `/get-bills?${queryPro}`,
          method: "GET",
        };
      },
    }),
    getBillById: builder.query({
      query: ({ oid }) => ({
        url: `detail/${oid}`,
        method: "GET",
      }),
    }),
    updateBill: builder.mutation({
      query: ({ orderId, billData }) => ({
        url: `${orderId}`,
        method: "PUT",
        body: billData,
      }),
    }),
    deleteBill: builder.mutation({
      query: (billId) => ({
        url: `${billId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateBillMutation,
  useGetBillsQuery,
  useGetBillByIdQuery,
  useUpdateBillMutation,
  useDeleteBillMutation,
} = billService;

export default billService;
