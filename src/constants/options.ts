import type {
  CandidateStatus,
  DocumentStatus,
  DocumentType,
  Gender,
  PaymentMethod,
  PaymentStatus,
  RecordStatus,
  UserRole } from
'../types/models';

export const CANDIDATE_STATUSES: CandidateStatus[] = [
'New',
'Processing',
'Selected',
'Visa Processing',
'Deployed',
'Rejected'];


export const GENDERS: Gender[] = ['Male', 'Female', 'Other'];

export const RECORD_STATUSES: RecordStatus[] = ['Active', 'Inactive'];

export const PAYMENT_STATUSES: PaymentStatus[] = ['Paid', 'Pending', 'Partial', 'Refunded'];

export const PAYMENT_METHODS: PaymentMethod[] = [
'Cash',
'Bank Transfer',
'bKash',
'Nagad',
'Cheque',
'Card'];


export const PAYMENT_TYPES: string[] = [
'Registration Fee',
'Service Charge',
'Medical Fee',
'Visa Fee',
'Ticket',
'Agent Commission',
'Refund'];


export const DOCUMENT_TYPES: DocumentType[] = [
'Passport',
'NID',
'Photo',
'CV',
'Medical',
'BMET',
'Visa',
'Ticket',
'Other'];


export const DOCUMENT_STATUSES: DocumentStatus[] = ['Pending', 'Uploaded', 'Verified', 'Rejected'];

export const USER_ROLES: UserRole[] = ['Admin', 'Manager', 'Data Entry', 'Viewer'];

export const JOB_POSITIONS: string[] = [
'Construction Worker',
'Electrician',
'Welder',
'Plumber',
'Driver',
'Cleaner',
'Security Guard',
'Housekeeper',
'Nurse',
'Cook',
'Mason',
'Factory Operator'];


export const ACTIVITY_MODULES: string[] = [
'Candidates',
'Agents',
'Countries',
'Payments',
'Documents',
'Users',
'Settings',
'Auth'];


export const ACTIVITY_ACTIONS: string[] = [
'Created candidate',
'Updated candidate',
'Updated candidate status',
'Deleted candidate',
'Added agent',
'Updated agent',
'Added country',
'Updated country',
'Recorded payment',
'Uploaded document',
'Verified document',
'Added user',
'Changed user role',
'Signed in'];


export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const DEFAULT_PAGE_SIZE = 10;