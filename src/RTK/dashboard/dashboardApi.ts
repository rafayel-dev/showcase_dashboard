import { api } from "../api";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalDelivered: number;
  salesData: { name: string; sales: number }[];
  orderStatusData: { name: string; value: number }[];
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/api/dashboard/stats",
      providesTags: ["Order"], // Refresh stats when orders change
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
