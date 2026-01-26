import { api } from '../api';

export const couponApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => '/api/coupons',
      providesTags: ['Coupon'],
    }),

    addCoupon: builder.mutation({
      query: (newCoupon) => ({
        url: '/api/coupons',
        method: 'POST',
        body: newCoupon,
      }),
      invalidatesTags: ['Coupon'],
    }),

    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/coupons/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),

    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/api/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),
  }),
});

export const { 
  useGetCouponsQuery, 
  useAddCouponMutation, 
  useUpdateCouponMutation, 
  useDeleteCouponMutation 
} = couponApi;
