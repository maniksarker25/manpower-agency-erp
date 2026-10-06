import type {
  CandidateStatus,
  DocumentStatus,
  PaymentStatus,
  RecordStatus,
  UserRole } from
'../types/models';

/**
 * Single source of truth for every status token in the application.
 * Components never hardcode status colors — they read from here.
 */
export interface StatusTone {
  label: string;
  className: string;
  dot: string;
}

const tone = (className: string, dot: string) => ({ className, dot });

const NEUTRAL = tone('bg-slate-100 text-slate-700 ring-slate-200', 'bg-slate-400');
const BLUE = tone('bg-blue-50 text-blue-700 ring-blue-200', 'bg-blue-500');
const INDIGO = tone('bg-indigo-50 text-indigo-700 ring-indigo-200', 'bg-indigo-500');
const AMBER = tone('bg-amber-50 text-amber-800 ring-amber-200', 'bg-amber-500');
const GREEN = tone('bg-emerald-50 text-emerald-700 ring-emerald-200', 'bg-emerald-500');
const RED = tone('bg-red-50 text-red-700 ring-red-200', 'bg-red-500');
const TEAL = tone('bg-teal-50 text-teal-700 ring-teal-200', 'bg-teal-500');

export const CANDIDATE_STATUS_TONES: Record<CandidateStatus, StatusTone> = {
  New: { label: 'New', ...NEUTRAL },
  Processing: { label: 'Processing', ...BLUE },
  Selected: { label: 'Selected', ...INDIGO },
  'Visa Processing': { label: 'Visa Processing', ...AMBER },
  Deployed: { label: 'Deployed', ...GREEN },
  Rejected: { label: 'Rejected', ...RED }
};

export const PAYMENT_STATUS_TONES: Record<PaymentStatus, StatusTone> = {
  Paid: { label: 'Paid', ...GREEN },
  Pending: { label: 'Pending', ...AMBER },
  Partial: { label: 'Partial', ...BLUE },
  Refunded: { label: 'Refunded', ...NEUTRAL }
};

export const DOCUMENT_STATUS_TONES: Record<DocumentStatus, StatusTone> = {
  Pending: { label: 'Pending', ...NEUTRAL },
  Uploaded: { label: 'Uploaded', ...BLUE },
  Verified: { label: 'Verified', ...GREEN },
  Rejected: { label: 'Rejected', ...RED }
};

export const RECORD_STATUS_TONES: Record<RecordStatus, StatusTone> = {
  Active: { label: 'Active', ...GREEN },
  Inactive: { label: 'Inactive', ...NEUTRAL }
};

export const USER_ROLE_TONES: Record<UserRole, StatusTone> = {
  Admin: { label: 'Admin', ...INDIGO },
  Manager: { label: 'Manager', ...TEAL },
  'Data Entry': { label: 'Data Entry', ...BLUE },
  Viewer: { label: 'Viewer', ...NEUTRAL }
};

/** Chart-friendly hex values, kept aligned with the badge tones above. */
export const CANDIDATE_STATUS_CHART_COLORS: Record<CandidateStatus, string> = {
  New: '#94a3b8',
  Processing: '#3b82f6',
  Selected: '#6366f1',
  'Visa Processing': '#f59e0b',
  Deployed: '#10b981',
  Rejected: '#ef4444'
};

/** Ordered pipeline used by the candidate status timeline. */
export const CANDIDATE_PIPELINE: CandidateStatus[] = [
'New',
'Processing',
'Selected',
'Visa Processing',
'Deployed'];