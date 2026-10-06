import { baseApi } from '../../app/store/api/baseApi';
import type { DashboardStats } from '../../types/models';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({ action: 'getDashboardStats' }),
      providesTags: ['Dashboard']
    })
  })
});

export const { useGetDashboardStatsQuery } = dashboardApi;