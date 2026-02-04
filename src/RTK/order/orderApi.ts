import { api } from "../api";
import type { Order } from "../../types";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      {
        orders: Order[];
        page: number;
        pages: number;
        total: number;
        pending: number;
        processing: number;
        confirmed: number;
        shipped: number;
        delivered: number;
        returned: number;
        cancelled: number;
      },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => `/api/orders?page=${page}&limit=${limit}`,
      transformResponse: (response: any) => {
        const mappedOrders = response.orders.map((order: any) => ({
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
          itemsPrice: order.itemsPrice || 0,
          totalAmount: order.totalPrice,
          shippingAddress: order.shippingAddress?.address || "",
          paymentMethod: order.paymentMethod,
          paymentStatus:
            order.paymentStatus || (order.isPaid ? "Paid" : "Unpaid"),
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
        return {
          orders: mappedOrders,
          page: response.page,
          pages: response.pages,
          total: response.total,
          pending: response.pending,
          processing: response.processing,
          confirmed: response.confirmed,
          shipped: response.shipped,
          delivered: response.delivered,
          returned: response.returned,
          cancelled: response.cancelled,
        };
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
