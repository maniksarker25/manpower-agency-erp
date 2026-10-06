import { baseApi } from '../../app/store/api/baseApi';
import type { Agent, ListQuery, Paginated } from '../../types/models';

export const agentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgents: builder.query<Paginated<Agent>, ListQuery>({
      query: (params) => ({ action: 'getAgents', params }),
      providesTags: [{ type: 'Agent', id: 'LIST' }]
    }),

    getAgentOptions: builder.query<Agent[], void>({
      query: () => ({ action: 'getAgentOptions' }),
      providesTags: [{ type: 'Agent', id: 'OPTIONS' }]
    }),

    createAgent: builder.mutation<Agent, Partial<Agent>>({
      query: (data) => ({ action: 'addAgent', method: 'POST', data }),
      invalidatesTags: ['Agent', 'Activity']
    }),

    updateAgent: builder.mutation<Agent, {id: string;data: Partial<Agent>;}>({
      query: ({ id, data }) => ({ action: 'updateAgent', method: 'POST', id, data }),
      invalidatesTags: ['Agent', 'Activity']
    }),

    deleteAgent: builder.mutation<{id: string;}, string>({
      query: (id) => ({ action: 'deleteAgent', method: 'POST', id }),
      invalidatesTags: ['Agent', 'Activity']
    })
  })
});

export const {
  useGetAgentsQuery,
  useGetAgentOptionsQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation
} = agentsApi;