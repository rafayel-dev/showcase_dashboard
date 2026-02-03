import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL = "http://localhost:5000";
// export const BASE_URL = "http://10.10.20.43:5000";
// export const BASE_URL = "https://ceiling-publishing-permits-stunning.trycloudflare.com";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Admins",
    "Category",
    "Coupon",
    "Product",
    "Order",
    "Notification",
    "Setting",
    "Slider",
    "Chat",
  ],
  endpoints: () => ({}),
});
