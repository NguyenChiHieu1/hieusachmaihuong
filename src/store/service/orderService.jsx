import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to get token from localStorage
const getToken = (type) => localStorage.getItem(type);

// Define API slice
const orderService = createApi({
  reducerPath: "orderService",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/order/", // Adjust base URL according to your backend
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
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "create",
        method: "POST",
        body: orderData,
      }),
    }),
    getOrders: builder.query({
      query: (queryString) => {
        //đưa vào 1 object trả về một query-string: vd:"page=1&limit=10&sort=price,desc&category=electronics"
        const queryPro = new URLSearchParams(queryString).toString();
        return {
          url: `/get-order?${queryPro}`,
          method: "GET",
        };
      },
    }),
    getOrdersByAdminId: builder.query({
      query: ({ oid }) => ({
        url: `detail/${oid}`,
        method: "GET",
      }),
    }),
    getFindOrders: builder.query({
      query: () => ({
        url: "/find-order-bill",
        method: "GET",
      }),
    }),
    getOrdersByUserId: builder.query({
      query: () => ({
        url: "userOrder",
        method: "GET",
      }),
    }),
    updateOrderByUser: builder.mutation({
      query: ({ orderId }) => ({
        url: `user-received/${orderId}`,
        method: "PUT",
      }),
    }),
    updateRatingsUser: builder.mutation({
      query: ({ orderId, productId }) => ({
        url: `/${orderId}/ratings/${productId}`,
        method: "PUT",
      }),
    }),
    cancelOrderUser: builder.mutation({
      query: ({ orderId }) => ({
        url: `/cancel-order/${orderId}`,
        method: "PUT",
      }),
    }),
    updateOrderByAdmin: builder.mutation({
      query: ({ orderId, orderData }) => ({
        url: `${orderId}`,
        method: "PUT",
        body: orderData,
      }),
    }),
    deleteOrder: builder.mutation({
      query: (oid) => ({
        url: `/${oid}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrdersByUserIdQuery,
  useGetOrdersByAdminIdQuery,
  useGetFindOrdersQuery,
  useUpdateOrderByUserMutation,
  useCancelOrderUserMutation,
  useUpdateRatingsUserMutation,
  useUpdateOrderByAdminMutation,
  useDeleteOrderMutation,
} = orderService;

export default orderService;
