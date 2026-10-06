import { baseApi } from '../../app/store/api/baseApi';
import type { DocumentRecord, DocumentStatus, ListQuery, Paginated } from '../../types/models';

export interface UploadDocumentPayload {
  candidateId: string;
  type: DocumentRecord['type'];
  title: string;
  documentUrl: string;
  fileName?: string;
  sizeKb?: number;
}

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<Paginated<DocumentRecord>, ListQuery>({
      query: (params) => ({ action: 'getDocuments', params }),
      providesTags: [{ type: 'Document', id: 'LIST' }]
    }),

    uploadDocument: builder.mutation<DocumentRecord, UploadDocumentPayload>({
      query: (data) => ({ action: 'uploadDocument', method: 'POST', data }),
      invalidatesTags: ['Document', 'Activity']
    }),

    updateDocumentStatus: builder.mutation<DocumentRecord, {id: string;status: DocumentStatus;}>({
      query: ({ id, status }) => ({
        action: 'updateDocumentStatus',
        method: 'POST',
        id,
        data: { status }
      }),
      invalidatesTags: ['Document', 'Activity']
    }),

    deleteDocument: builder.mutation<{id: string;}, string>({
      query: (id) => ({ action: 'deleteDocument', method: 'POST', id }),
      invalidatesTags: ['Document', 'Activity']
    })
  })
});

export const {
  useGetDocumentsQuery,
  useUploadDocumentMutation,
  useUpdateDocumentStatusMutation,
  useDeleteDocumentMutation
} = documentsApi;