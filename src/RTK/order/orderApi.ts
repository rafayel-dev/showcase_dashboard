import { api } from "../api";
import type { Order } from "../../types";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => "/api/orders",
      transformResponse: (response: any[]) => {
        return response.map((order: any) => ({
          key: order._id,
          id: order._id,
          orderId:
            order.orderId ||
            `#${order._id.substring(order._id.length - 6).toUpperCase()}`,
          customerName: order.customerInfo?.name || order.user?.name || "Guest",
          customerEmail: order.customerInfo?.email || order.user?.email || "",
          customerDistrict: order.shippingAddress?.city || "",
          orderDate: order.createdAt ? order.createdAt.split("T")[0] : "",
          status: order.status,
          totalAmount: order.totalPrice,
          shippingAddress: order.shippingAddress?.address || "",
          paymentMethod: order.paymentMethod,
          paymentStatus: order.isPaid ? "Paid" : "Unpaid",
          customerMobile: order.customerInfo?.phone || "",
          courier: order.courier,
          deliveryCharge: order.shippingPrice || 60,
          items:
            order.orderItems?.map((item: any) => ({
              productId: item.product?._id || item.product,
              productName: item.name,
              sku: item.product?.sku || "—",
              quantity: item.qty,
              price: item.price,
              size: item.size ? [item.size] : [],
              color: item.color ? [item.color] : [],
            })) || [],
        }));
      },
      providesTags: ["Order"],
    }),
    updateOrder: builder.mutation<Order, Partial<Order> & { id: string }>({
      query: ({ id, ...patch }) => {
        const body: any = { ...patch };
        // Map frontend paymentStatus to backend isPaid
        if (patch.paymentStatus) {
          body.isPaid = patch.paymentStatus === "Paid";
        }
        return {
          url: `/api/orders/${id}`,
          method: "PUT",
          body: body,
        };
      },
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useGetOrdersQuery, useUpdateOrderMutation } = orderApi;
