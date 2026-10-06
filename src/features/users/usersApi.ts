import { baseApi } from '../../app/store/api/baseApi';
import type { ListQuery, Paginated, UserAccount } from '../../types/models';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<Paginated<UserAccount>, ListQuery>({
      query: (params) => ({ action: 'getUsers', params }),
      providesTags: [{ type: 'User', id: 'LIST' }]
    }),

    createUser: builder.mutation<UserAccount, Partial<UserAccount>>({
      query: (data) => ({ action: 'addUser', method: 'POST', data }),
      invalidatesTags: ['User', 'Activity']
    }),

    updateUser: builder.mutation<UserAccount, {id: string;data: Partial<UserAccount>;}>({
      query: ({ id, data }) => ({ action: 'updateUser', method: 'POST', id, data }),
      invalidatesTags: ['User', 'Activity']
    }),

    deleteUser: builder.mutation<{id: string;}, string>({
      query: (id) => ({ action: 'deleteUser', method: 'POST', id }),
      invalidatesTags: ['User', 'Activity']
    })
  })
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = usersApi;