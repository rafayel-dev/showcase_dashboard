import { api } from '../api';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/api/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/api/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/api/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useForgotPasswordMutation, useVerifyOtpMutation, useResetPasswordMutation } = authApi;
