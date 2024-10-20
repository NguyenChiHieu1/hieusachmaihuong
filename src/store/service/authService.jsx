import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Lấy token từ localStorage hoặc từ redux store
const getToken = (type) => localStorage.getItem(type);

const authService = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/user/",
    prepareHeaders: (headers, {}) => {
      const token = getToken("admin-token") || getToken("user-token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      authLogin: builder.mutation({
        query: (loginData) => {
          return {
            url: "login",
            method: "POST",
            body: loginData,
          };
        },
      }),
      userRegister: builder.mutation({
        query: (data) => {
          return {
            url: "/register",
            method: "POST",
            body: data,
          };
        },
      }),
      userLogout: builder.mutation({
        query: () => ({
          url: "/logout",
          method: "POST",
        }),
      }),
      userForgotPassword: builder.mutation({
        query: (data) => {
          return {
            url: "/forgot-password",
            method: "POST",
            body: data,
          };
        },
      }),
      userResetPassword: builder.mutation({
        // chú ý cái nay params cho chuẩn------>>
        query: ({ data, resetCode }) => {
          return {
            url: `/reset-password/${resetCode}`,
            method: "PUT",
            body: data,
          };
        },
      }),
      useGetInfoUser: builder.query({
        query: () => ({
          url: "/get-info-login",
          method: "GET",
        }),
      }),
      getUser: builder.query({
        query: ({ role }) => ({
          url: `/${role}`,
          method: "GET",
        }),
      }),
      getAccount: builder.query({
        query: (queryString) => {
          const queryPro = new URLSearchParams(queryString).toString();
          return { url: `/account?${queryPro}`, method: "GET" };
        },
      }),
      update: builder.mutation({
        query: ({ dataProduct }) => {
          return {
            url: "/update",
            method: "PUT",
            body: dataProduct,
          };
        },
      }),
      updateAccount: builder.mutation({
        query: ({ id, dataAccount }) => {
          return {
            url: `/account/${id}`,
            method: "PUT",
            body: dataAccount,
          };
        },
      }),
      createAccount: builder.mutation({
        query: ({ dataProduct }) => {
          return {
            url: "/account",
            method: "POST",
            body: dataProduct,
          };
        },
      }),
      deleteAccount: builder.mutation({
        query: ({ _id }) => {
          return {
            url: "/delete",
            method: "DELETE",
            // chú ý
            body: { _id },
          };
        },
      }),
    };
  },
});
export const {
  useAuthLoginMutation,
  useUserRegisterMutation,
  useUserLogoutMutation,
  useUserForgotPasswordMutation,
  useUserResetPasswordMutation,
  useUseGetInfoUserQuery,
  useGetAccountQuery,
  useGetUserQuery,
  useUpdateMutation,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = authService;
export default authService;
