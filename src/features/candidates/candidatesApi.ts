import { baseApi } from '../../app/store/api/baseApi';
import type { Candidate, CandidateStatus, ListQuery, Paginated } from '../../types/models';

export const candidatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCandidates: builder.query<Paginated<Candidate>, ListQuery>({
      query: (params) => ({ action: 'getCandidates', params }),
      providesTags: (result) =>
      result ?
      [
      ...result.items.map((item) => ({ type: 'Candidate' as const, id: item.id })),
      { type: 'Candidate' as const, id: 'LIST' }] :

      [{ type: 'Candidate' as const, id: 'LIST' }]
    }),

    getCandidate: builder.query<Candidate, string>({
      query: (id) => ({ action: 'getCandidate', id }),
      providesTags: (_result, _error, id) => [{ type: 'Candidate', id }]
    }),

    createCandidate: builder.mutation<Candidate, Partial<Candidate>>({
      query: (data) => ({ action: 'addCandidate', method: 'POST', data }),
      invalidatesTags: [
      { type: 'Candidate', id: 'LIST' },
      'Dashboard',
      'Activity',
      'Agent',
      'Country']

    }),

    updateCandidate: builder.mutation<Candidate, {id: string;data: Partial<Candidate>;}>({
      query: ({ id, data }) => ({ action: 'updateCandidate', method: 'POST', id, data }),
      invalidatesTags: (_result, _error, { id }) => [
      { type: 'Candidate', id },
      { type: 'Candidate', id: 'LIST' },
      'Dashboard',
      'Activity']

    }),

    updateCandidateStatus: builder.mutation<
      Candidate,
      {id: string;status: CandidateStatus;remarks?: string;}>(
      {
        query: ({ id, status, remarks }) => ({
          action: 'updateCandidateStatus',
          method: 'POST',
          id,
          data: { status, remarks }
        }),
        invalidatesTags: (_result, _error, { id }) => [
        { type: 'Candidate', id },
        { type: 'Candidate', id: 'LIST' },
        'Dashboard',
        'Activity']

      }),

    deleteCandidate: builder.mutation<{id: string;}, string>({
      query: (id) => ({ action: 'deleteCandidate', method: 'POST', id }),
      invalidatesTags: [{ type: 'Candidate', id: 'LIST' }, 'Dashboard', 'Activity']
    })
  })
});

export const {
  useGetCandidatesQuery,
  useGetCandidateQuery,
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
  useUpdateCandidateStatusMutation,
  useDeleteCandidateMutation
} = candidatesApi;