import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Lấy token từ localStorage hoặc từ redux store
const getToken = () => localStorage.getItem("admin-token");

const couponService = createApi({
  reducerPath: "coupon",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/coupon/", // Thay đổi baseUrl theo API của bạn
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint để tạo coupon mới
    createCoupon: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
    }),
    // Endpoint để lấy tất cả các coupon
    getAllCoupons: builder.query({
      query: () => ({
        url: "/get-coupon",
        method: "GET",
      }),
    }),
    // Endpoint để lấy tất cả các discount (#coupon: giam gia khong can mã code)
    getAllDiscounts: builder.query({
      query: () => ({
        url: "/get-discount",
        method: "GET",
      }),
    }),
    getCoupons: builder.query({
      query: (queryString) => {
        const queryPro = new URLSearchParams(queryString).toString();
        return {
          url: `/get-coupons?${queryPro}`,
          method: "GET",
        };
      },
    }),
    // Endpoint để lấy một coupon theo ID
    getCouponById: builder.query({
      query: (cid) => `/get-id/${cid}`,
    }),
    // Endpoint để cập nhật một coupon theo ID
    updateCoupon: builder.mutation({
      query: ({ cid, updatedCoupon }) => ({
        url: `/update/${cid}`,
        method: "PUT",
        body: updatedCoupon,
      }),
    }),
    // Endpoint để xóa một coupon theo ID
    deleteCoupon: builder.mutation({
      query: (cid) => ({
        url: `/delete/${cid}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useGetAllCouponsQuery,
  useGetAllDiscountsQuery,
  useGetCouponByIdQuery,
  useGetCouponsQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponService;

export default couponService;
