import { baseApi } from '../../app/store/api/baseApi';
import type { UserAccount } from '../../types/models';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserAccount;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (data) => ({ action: 'login', method: 'POST', data })
    }),
    getProfile: builder.query<UserAccount, void>({
      query: () => ({ action: 'getProfile' }),
      providesTags: ['Profile']
    })
  })
});

export const { useLoginMutation, useGetProfileQuery } = authApi;