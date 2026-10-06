import { baseApi } from '../../app/store/api/baseApi';
import type { ActivityEntry, ListQuery, Paginated } from '../../types/models';

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivity: builder.query<Paginated<ActivityEntry>, ListQuery>({
      query: (params) => ({ action: 'getActivity', params }),
      providesTags: ['Activity']
    })
  })
});

export const { useGetActivityQuery } = activityApi;