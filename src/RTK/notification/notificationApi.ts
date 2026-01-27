import { api } from "../api";

export interface Notification {
  _id: string;
  title: string;
  description: string;
  timestamp: string; // mapped from createdAt
  read: boolean;
  type: "new_product" | "order_update" | "system_alert" | "new_order";
  createdAt: string;
}

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => "/api/notifications",
      providesTags: ["Notification"],
      transformResponse: (response: any[]) => {
        return response.map((n) => ({
          ...n,
          timestamp: n.createdAt, // Map backend createdAt to timestamp expected by UI component (or I update UI component)
        }));
      },
    }),
    markAsRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/api/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/api/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
