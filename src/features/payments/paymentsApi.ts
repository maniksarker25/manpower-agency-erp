import { baseApi } from '../../app/store/api/baseApi';
import type { ListQuery, Paginated, Payment } from '../../types/models';

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<Paginated<Payment>, ListQuery>({
      query: (params) => ({ action: 'getPayments', params }),
      providesTags: [{ type: 'Payment', id: 'LIST' }]
    }),

    createPayment: builder.mutation<Payment, Partial<Payment>>({
      query: (data) => ({ action: 'addPayment', method: 'POST', data }),
      invalidatesTags: ['Payment', 'Dashboard', 'Activity']
    }),

    updatePayment: builder.mutation<Payment, {id: string;data: Partial<Payment>;}>({
      query: ({ id, data }) => ({ action: 'updatePayment', method: 'POST', id, data }),
      invalidatesTags: ['Payment', 'Dashboard', 'Activity']
    }),

    deletePayment: builder.mutation<{id: string;}, string>({
      query: (id) => ({ action: 'deletePayment', method: 'POST', id }),
      invalidatesTags: ['Payment', 'Dashboard', 'Activity']
    })
  })
});

export const {
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation
} = paymentsApi;