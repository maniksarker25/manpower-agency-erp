import { z } from 'zod';
import { RECORD_STATUSES } from '../../constants/options';
import type { RecordStatus } from '../../types/models';

export const countrySchema = z.object({
  name: z.string().min(2, 'Country name is required').max(60),
  code: z.
  string().
  min(2, 'Country code is required').
  max(3, 'Use the 2–3 letter ISO code').
  regex(/^[A-Za-z]+$/, 'Letters only'),
  status: z.enum(RECORD_STATUSES as [RecordStatus, ...RecordStatus[]])
});

export type CountryFormValues = z.infer<typeof countrySchema>;