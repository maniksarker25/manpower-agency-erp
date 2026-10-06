import { z } from 'zod';
import { CANDIDATE_STATUSES, GENDERS } from '../../constants/options';
import type { CandidateStatus, Gender } from '../../types/models';

export const candidateSchema = z.object({
  fullName: z.string().min(3, 'Full name is required').max(80, 'Name is too long'),
  mobile: z.
  string().
  min(6, 'Mobile number is required').
  regex(/^[+\d][\d\s-]{5,}$/, 'Enter a valid mobile number'),
  passportNo: z.string().min(5, 'NID or passport number is required').max(30),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.enum(GENDERS as [Gender, ...Gender[]]),

  country: z.string().min(1, 'Country is required'),
  jobPosition: z.string().min(1, 'Job position is required'),
  salary: z.coerce.number().min(0, 'Salary cannot be negative').max(100000),
  agentId: z.string().min(1, 'Agent is required'),
  status: z.enum(CANDIDATE_STATUSES as [CandidateStatus, ...CandidateStatus[]]),

  registrationDate: z.string().min(1, 'Registration date is required'),
  remarks: z.string().max(500, 'Remarks must be under 500 characters').optional().or(z.literal(''))
});

export type CandidateFormValues = z.infer<typeof candidateSchema>;

export const candidateStatusSchema = z.object({
  status: z.enum(CANDIDATE_STATUSES as [CandidateStatus, ...CandidateStatus[]]),
  remarks: z.string().max(500).optional().or(z.literal(''))
});

export type CandidateStatusFormValues = z.infer<typeof candidateStatusSchema>;