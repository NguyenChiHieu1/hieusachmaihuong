import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getToken = () => localStorage.getItem("user-token");

const cartService = createApi({
  reducerPath: "cart",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/cart/",
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint để thêm sản phẩm vào giỏ hàng
    addItemToCart: builder.mutation({
      query: (items) => ({
        url: "/create",
        method: "POST",
        body: items,
      }),
    }),
    // Endpoint để lấy giỏ hàng của người dùng theo userId
    getCartByUserId: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
    // Endpoint để xóa sản phẩm khỏi giỏ hàng
    removeItemFromCart: builder.mutation({
      query: (productId) => ({
        url: "/delete-item",
        method: "DELETE",
        body: { productId },
      }),
    }),
    // Endpoint để xóa toàn bộ giỏ hàng
    deleteCart: builder.mutation({
      query: () => ({
        url: "/delete-cart",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddItemToCartMutation,
  useGetCartByUserIdQuery,
  useRemoveItemFromCartMutation,
  useDeleteCartMutation,
  // resetApiState,
} = cartService;
// export const { resetApiState } = cartService;
export default cartService;
