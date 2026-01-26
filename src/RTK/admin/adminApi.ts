import { api } from '../api';
import type { Admin } from '../../types';

export interface AddAdminRequest {
  name: string;
  email: string;
  password?: string;
}

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<Admin[], void>({
      query: () => '/api/admins',
      transformResponse: (response: any[]) => {
        return response.map((item) => ({ ...item, id: item._id }));
      },
      providesTags: ['Admins'],
    }),
    addAdmin: builder.mutation<Admin, AddAdminRequest>({
      query: (newAdmin) => ({
        url: '/api/admins/create-admin',
        method: 'POST',
        body: newAdmin,
      }),
      transformResponse: (response: any) => ({ ...response, id: response._id }),
      invalidatesTags: ['Admins'],
    }),
    deleteAdmin: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admins'],
    }),
  }),
});

export const { useGetAdminsQuery, useAddAdminMutation, useDeleteAdminMutation } = adminApi;
