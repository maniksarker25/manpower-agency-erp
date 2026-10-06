import { z } from 'zod';
import { DOCUMENT_TYPES } from '../../constants/options';
import type { DocumentType } from '../../types/models';

export const documentUploadSchema = z.object({
  candidateId: z.string().min(1, 'Candidate is required'),
  type: z.enum(DOCUMENT_TYPES as [DocumentType, ...DocumentType[]]),
  title: z.string().min(1, 'Document title is required'),
  documentUrl: z
    .string()
    .min(1, 'Document link is required')
    .refine((val) => {
      try {
        const url = new URL(val);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    }, 'Please enter a valid web link (starting with http:// or https://)')
});

export type DocumentUploadValues = z.infer<typeof documentUploadSchema>;