/** Domain models shared across features. Mirrors the Google Sheets tab schemas. */

export type CandidateStatus =
'New' |
'Processing' |
'Selected' |
'Visa Processing' |
'Deployed' |
'Rejected';

export type Gender = 'Male' | 'Female' | 'Other';

export type RecordStatus = 'Active' | 'Inactive';

export type PaymentStatus = 'Paid' | 'Pending' | 'Partial' | 'Refunded';

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'bKash' | 'Nagad' | 'Cheque' | 'Card';

export type DocumentType =
'Passport' |
'NID' |
'Photo' |
'CV' |
'Medical' |
'BMET' |
'Visa' |
'Ticket' |
'Other';

export type DocumentStatus = 'Pending' | 'Uploaded' | 'Verified' | 'Rejected';

export type UserRole = 'Admin' | 'Manager' | 'Data Entry' | 'Viewer';

export interface Candidate {
  id: string;
  registrationDate: string;
  fullName: string;
  mobile: string;
  passportNo: string;
  dateOfBirth: string;
  gender: Gender;
  country: string;
  jobPosition: string;
  salary: number;
  agentId: string;
  agentName: string;
  status: CandidateStatus;
  remarks: string;
  email?: string;
  address?: string;
}

export interface Agent {
  id: string;
  name: string;
  mobile: string;
  address: string;
  commission: number;
  status: RecordStatus;
  candidates: number;
  createdDate: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  status: RecordStatus;
  candidates: number;
  createdDate: string;
}

export interface Payment {
  id: string;
  candidateId: string;
  candidateName: string;
  paymentType: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  remarks: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  documentUrl: string;
  candidateId: string;
  candidateName: string;
  type: DocumentType;
  status: DocumentStatus;
  uploadedDate: string;
  fileName?: string;
  sizeKb?: number;
  /** Google Drive file id, populated by the Apps Script backend. */
  driveFileId?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: RecordStatus;
  lastLogin: string;
  createdDate: string;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  record: string;
  details: string;
}

export interface DashboardStats {
  totals: {
    candidates: number;
    new: number;
    processing: number;
    selected: number;
    visaProcessing: number;
    deployed: number;
    rejected: number;
  };
  changes: Record<string, number>;
  statusOverview: {status: CandidateStatus;count: number;}[];
  byCountry: {country: string;candidates: number;deployed: number;}[];
  monthly: {month: string;registered: number;deployed: number;}[];
  recentCandidates: Candidate[];
  recentActivity: ActivityEntry[];
  paymentSummary: {collected: number;pending: number;refunded: number;};
}

/** Generic list envelope returned by every collection endpoint. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Query params shape shared by list endpoints — passed straight through to the API. */
export interface ListQuery {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  [key: string]: string | number | undefined;
}