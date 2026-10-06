import { z } from 'zod';
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '../../constants/options';
import type { PaymentMethod, PaymentStatus } from '../../types/models';

export const paymentSchema = z.object({
  candidateId: z.string().min(1, 'Candidate is required'),
  paymentType: z.string().min(1, 'Payment type is required'),
  amount: z.coerce.number().positive('Amount must be greater than zero').max(1000000),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMethod: z.enum(PAYMENT_METHODS as [PaymentMethod, ...PaymentMethod[]]),
  status: z.enum(PAYMENT_STATUSES as [PaymentStatus, ...PaymentStatus[]]),
  remarks: z.string().max(300).optional().or(z.literal(''))
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;