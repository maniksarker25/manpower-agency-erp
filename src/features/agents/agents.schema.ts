import { z } from 'zod';
import { RECORD_STATUSES } from '../../constants/options';
import type { RecordStatus } from '../../types/models';

export const agentSchema = z.object({
  name: z.string().min(3, 'Agent name is required').max(80),
  mobile: z.
  string().
  min(6, 'Mobile number is required').
  regex(/^[+\d][\d\s-]{5,}$/, 'Enter a valid mobile number'),
  address: z.string().min(3, 'Address is required').max(160),
  commission: z.coerce.
  number().
  min(0, 'Commission cannot be negative').
  max(100, 'Commission cannot exceed 100%'),
  status: z.enum(RECORD_STATUSES as [RecordStatus, ...RecordStatus[]])
});

export type AgentFormValues = z.infer<typeof agentSchema>;