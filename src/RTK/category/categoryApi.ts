import { api } from '../api';

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/api/categories',
      providesTags: ['Category'],
    }),
    
    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: '/api/categories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const { 
  useGetCategoriesQuery, 
  useAddCategoryMutation, 
  useUpdateCategoryMutation,
  useDeleteCategoryMutation 
} = categoryApi;
