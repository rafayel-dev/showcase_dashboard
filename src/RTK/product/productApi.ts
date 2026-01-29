import { api } from "../api";
import type { Product } from "../../types";

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      { products: Product[]; page: number; pages: number; total: number },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => `/api/products?page=${page}&limit=${limit}`,
      transformResponse: (response: any) => response,
      providesTags: ["Product"],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/api/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/api/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Product",
        { type: "Product", id },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    uploadImage: builder.mutation({
      query: ({ formData, productId }) => ({
        url: `/api/upload${productId ? `?productId=${productId}` : ""}`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImageMutation,
} = productApi;
