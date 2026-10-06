import { z } from 'zod';
import { RECORD_STATUSES, USER_ROLES } from '../../constants/options';
import type { RecordStatus, UserRole } from '../../types/models';

export const userSchema = z.object({
  name: z.string().min(3, 'Full name is required').max(80),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  role: z.enum(USER_ROLES as [UserRole, ...UserRole[]]),
  status: z.enum(RECORD_STATUSES as [RecordStatus, ...RecordStatus[]])
});

export type UserFormValues = z.infer<typeof userSchema>;