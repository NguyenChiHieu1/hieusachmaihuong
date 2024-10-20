import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getToken = (type) => localStorage.getItem(type);
const paymentService = createApi({
  reducerPath: "payment",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/payment",
    prepareHeaders: (headers) => {
      const token = getToken("user-token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      sendPayment: builder.mutation({
        query: (cart) => {
          return {
            url: "/create-checkout-session",
            method: "POST",
            body: cart,
          };
        },
      }),
      verifyPayment: builder.query({
        query: (id) => {
          return {
            url: `payment-verify/${id}`,
            method: "GET",
          };
        },
      }),
    };
  },
});
export const { useSendPaymentMutation, useVerifyPaymentQuery } = paymentService;
export default paymentService;
