import { baseApi } from '../../app/store/api/baseApi';
import type { Country, ListQuery, Paginated } from '../../types/models';

export const countriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<Paginated<Country>, ListQuery>({
      query: (params) => ({ action: 'getCountries', params }),
      providesTags: [{ type: 'Country', id: 'LIST' }]
    }),

    getCountryOptions: builder.query<Country[], void>({
      query: () => ({ action: 'getCountryOptions' }),
      providesTags: [{ type: 'Country', id: 'OPTIONS' }]
    }),

    createCountry: builder.mutation<Country, Partial<Country>>({
      query: (data) => ({ action: 'addCountry', method: 'POST', data }),
      invalidatesTags: ['Country', 'Activity']
    }),

    updateCountry: builder.mutation<Country, {id: string;data: Partial<Country>;}>({
      query: ({ id, data }) => ({ action: 'updateCountry', method: 'POST', id, data }),
      invalidatesTags: ['Country', 'Activity']
    }),

    deleteCountry: builder.mutation<{id: string;}, string>({
      query: (id) => ({ action: 'deleteCountry', method: 'POST', id }),
      invalidatesTags: ['Country', 'Activity']
    })
  })
});

export const {
  useGetCountriesQuery,
  useGetCountryOptionsQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation
} = countriesApi;