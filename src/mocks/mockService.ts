import type {
  ActivityEntry,
  Agent,
  Candidate,
  Country,
  DocumentRecord,
  Payment,
  UserAccount } from
'../types/models';
import { matchesEquals, matchesSearch, paginate, sortItems, withinDateRange } from '../utils/collection';
import { activity as activitySeed } from './activity';
import { agents as agentsSeed } from './agents';
import { candidates as candidatesSeed } from './candidates';
import { countries as countriesSeed } from './countries';
import { buildDashboardStats } from './dashboard';
import { documents as documentsSeed } from './documents';
import { payments as paymentsSeed } from './payments';
import { pad } from './seed';
import { currentUser, users as usersSeed } from './users';

export interface ApiRequest {
  action: string;
  id?: string;
  data?: Record<string, unknown>;
  params?: Record<string, string | number | undefined>;
}

type Params = Record<string, string | number | undefined>;

/** In-memory database standing in for the Google Sheets tabs. */
const db = {
  candidates: [...candidatesSeed] as Candidate[],
  agents: [...agentsSeed] as Agent[],
  countries: [...countriesSeed] as Country[],
  payments: [...paymentsSeed] as Payment[],
  documents: [...documentsSeed] as DocumentRecord[],
  users: [...usersSeed] as UserAccount[],
  activity: [...activitySeed] as ActivityEntry[]
};

function recount(): void {
  db.agents.forEach((agent) => {
    agent.candidates = db.candidates.filter((c) => c.agentId === agent.id).length;
  });
  db.countries.forEach((country) => {
    country.candidates = db.candidates.filter((c) => c.country === country.name).length;
  });
}
recount();

function str(params: Params, key: string): string | undefined {
  const value = params[key];
  if (value === undefined || value === '' || value === 'all') return undefined;
  return String(value);
}

function num(params: Params, key: string, fallback: number): number {
  const value = Number(params[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function nextId(prefix: string, list: {id: string;}[], length = 5): string {
  const highest = list.reduce((max, item) => {
    const parsed = Number(item.id.split('-')[1]);
    return Number.isFinite(parsed) && parsed > max ? parsed : max;
  }, 0);
  return `${prefix}-${pad(highest + 1, length)}`;
}

function log(action: string, module: string, record: string, details: string): void {
  db.activity.unshift({
    id: `ACT-${pad(db.activity.length + 1, 5)}`,
    timestamp: new Date().toISOString(),
    user: currentUser.name,
    action,
    module,
    record,
    details
  });
}

function notFound(entity: string, id?: string): never {
  throw new Error(`${entity} ${id ?? ''} was not found.`);
}

/* ------------------------------- candidates ------------------------------- */

function listCandidates(params: Params) {
  let items = db.candidates.filter((candidate) => {
    return (
      matchesSearch(candidate, ['id', 'fullName', 'mobile', 'passportNo'], str(params, 'search')) &&
      matchesEquals(candidate, 'country', str(params, 'country')) &&
      matchesEquals(candidate, 'status', str(params, 'status')) &&
      matchesEquals(candidate, 'agentId', str(params, 'agentId')) &&
      matchesEquals(candidate, 'gender', str(params, 'gender')) &&
      matchesEquals(candidate, 'jobPosition', str(params, 'jobPosition')) &&
      withinDateRange(candidate.registrationDate, str(params, 'dateFrom'), str(params, 'dateTo')));

  });

  items = sortItems(
    items,
    str(params, 'sortBy') ?? 'registrationDate',
    str(params, 'sortDir') as 'asc' | 'desc' ?? 'desc'
  );

  return paginate(items, num(params, 'page', 1), num(params, 'pageSize', 10));
}

/* --------------------------------- router --------------------------------- */

const handlers: Record<string, (req: ApiRequest) => unknown> = {
  /* auth */
  login: ({ data }) => {
    const email = String(data?.email ?? '').toLowerCase();
    const account = db.users.find((user) => user.email.toLowerCase() === email) ?? currentUser;
    if (account.status === 'Inactive') throw new Error('This account has been deactivated.');
    log('Signed in', 'Auth', '—', `Successful sign-in as ${account.name}.`);
    return { token: `mock-token-${account.id}`, user: account };
  },
  getProfile: () => currentUser,

  /* dashboard */
  getDashboardStats: () => buildDashboardStats(db.candidates),

  /* candidates */
  getCandidates: ({ params }) => listCandidates(params ?? {}),
  getCandidate: ({ id }) => db.candidates.find((c) => c.id === id) ?? notFound('Candidate', id),
  addCandidate: ({ data }) => {
    const agent = db.agents.find((a) => a.id === data?.agentId);
    const candidate: Candidate = {
      id: nextId('CAN', db.candidates),
      registrationDate: String(data?.registrationDate ?? new Date().toISOString().slice(0, 10)),
      fullName: String(data?.fullName ?? ''),
      mobile: String(data?.mobile ?? ''),
      passportNo: String(data?.passportNo ?? ''),
      dateOfBirth: String(data?.dateOfBirth ?? ''),
      gender: data?.gender as Candidate['gender'] ?? 'Male',
      country: String(data?.country ?? ''),
      jobPosition: String(data?.jobPosition ?? ''),
      salary: Number(data?.salary ?? 0),
      agentId: String(data?.agentId ?? ''),
      agentName: agent?.name ?? '—',
      status: data?.status as Candidate['status'] ?? 'New',
      remarks: String(data?.remarks ?? '')
    };
    db.candidates.unshift(candidate);
    recount();
    log('Created candidate', 'Candidates', candidate.id, `New candidate ${candidate.id} registered.`);
    return candidate;
  },
  updateCandidate: ({ id, data }) => {
    const candidate = db.candidates.find((c) => c.id === id) ?? notFound('Candidate', id);
    const agent = db.agents.find((a) => a.id === data?.agentId);
    Object.assign(candidate, data, agent ? { agentName: agent.name } : {});
    recount();
    log('Updated candidate', 'Candidates', candidate.id, `Candidate ${candidate.id} details updated.`);
    return candidate;
  },
  updateCandidateStatus: ({ id, data }) => {
    const candidate = db.candidates.find((c) => c.id === id) ?? notFound('Candidate', id);
    candidate.status = data?.status as Candidate['status'];
    if (data?.remarks) candidate.remarks = String(data.remarks);
    log(
      'Updated candidate status',
      'Candidates',
      candidate.id,
      `Status of ${candidate.id} changed to ${candidate.status}.`
    );
    return candidate;
  },
  deleteCandidate: ({ id }) => {
    const index = db.candidates.findIndex((c) => c.id === id);
    if (index < 0) notFound('Candidate', id);
    db.candidates.splice(index, 1);
    recount();
    log('Deleted candidate', 'Candidates', String(id), `Candidate ${id} removed from the register.`);
    return { id };
  },

  /* agents */
  getAgents: ({ params = {} }) => {
    const items = db.agents.filter(
      (agent) =>
      matchesSearch(agent, ['id', 'name', 'mobile', 'address'], str(params, 'search')) &&
      matchesEquals(agent, 'status', str(params, 'status'))
    );
    return paginate(
      sortItems(items, str(params, 'sortBy') ?? 'name', str(params, 'sortDir') as 'asc' | 'desc' ?? 'asc'),
      num(params, 'page', 1),
      num(params, 'pageSize', 10)
    );
  },
  getAgentOptions: () => db.agents.filter((agent) => agent.status === 'Active'),
  addAgent: ({ data }) => {
    const agent: Agent = {
      id: nextId('AGT', db.agents, 3),
      name: String(data?.name ?? ''),
      mobile: String(data?.mobile ?? ''),
      address: String(data?.address ?? ''),
      commission: Number(data?.commission ?? 0),
      status: data?.status as Agent['status'] ?? 'Active',
      candidates: 0,
      createdDate: new Date().toISOString().slice(0, 10)
    };
    db.agents.push(agent);
    log('Added agent', 'Agents', agent.id, `Agent ${agent.name} added to the network.`);
    return agent;
  },
  updateAgent: ({ id, data }) => {
    const agent = db.agents.find((a) => a.id === id) ?? notFound('Agent', id);
    Object.assign(agent, data);
    log('Updated agent', 'Agents', agent.id, `Agent ${agent.name} updated.`);
    return agent;
  },
  deleteAgent: ({ id }) => {
    const index = db.agents.findIndex((a) => a.id === id);
    if (index < 0) notFound('Agent', id);
    const [removed] = db.agents.splice(index, 1);
    log('Deleted agent', 'Agents', removed.id, `Agent ${removed.name} archived.`);
    return { id };
  },

  /* countries */
  getCountries: ({ params = {} }) => {
    const items = db.countries.filter(
      (country) =>
      matchesSearch(country, ['name', 'code'], str(params, 'search')) &&
      matchesEquals(country, 'status', str(params, 'status'))
    );
    return paginate(
      sortItems(items, str(params, 'sortBy') ?? 'name', str(params, 'sortDir') as 'asc' | 'desc' ?? 'asc'),
      num(params, 'page', 1),
      num(params, 'pageSize', 25)
    );
  },
  getCountryOptions: () => db.countries.filter((country) => country.status === 'Active'),
  addCountry: ({ data }) => {
    const country: Country = {
      id: nextId('CTR', db.countries, 3),
      name: String(data?.name ?? ''),
      code: String(data?.code ?? '').toUpperCase(),
      status: data?.status as Country['status'] ?? 'Active',
      candidates: 0,
      createdDate: new Date().toISOString().slice(0, 10)
    };
    db.countries.push(country);
    log('Added country', 'Countries', country.id, `Country ${country.name} added.`);
    return country;
  },
  updateCountry: ({ id, data }) => {
    const country = db.countries.find((c) => c.id === id) ?? notFound('Country', id);
    Object.assign(country, data);
    log('Updated country', 'Countries', country.id, `Country ${country.name} updated.`);
    return country;
  },
  deleteCountry: ({ id }) => {
    const index = db.countries.findIndex((c) => c.id === id);
    if (index < 0) notFound('Country', id);
    const [removed] = db.countries.splice(index, 1);
    log('Deleted country', 'Countries', removed.id, `Country ${removed.name} archived.`);
    return { id };
  },

  /* payments */
  getPayments: ({ params = {} }) => {
    const items = db.payments.filter(
      (payment) =>
      matchesSearch(payment, ['id', 'candidateId', 'candidateName', 'remarks'], str(params, 'search')) &&
      matchesEquals(payment, 'status', str(params, 'status')) &&
      matchesEquals(payment, 'paymentType', str(params, 'paymentType')) &&
      matchesEquals(payment, 'candidateId', str(params, 'candidateId')) &&
      withinDateRange(payment.paymentDate, str(params, 'dateFrom'), str(params, 'dateTo'))
    );
    return paginate(
      sortItems(items, str(params, 'sortBy') ?? 'paymentDate', str(params, 'sortDir') as 'asc' | 'desc' ?? 'desc'),
      num(params, 'page', 1),
      num(params, 'pageSize', 10)
    );
  },
  addPayment: ({ data }) => {
    const candidate = db.candidates.find((c) => c.id === data?.candidateId);
    const payment: Payment = {
      id: nextId('PAY', db.payments, 4),
      candidateId: String(data?.candidateId ?? ''),
      candidateName: candidate?.fullName ?? '—',
      paymentType: String(data?.paymentType ?? ''),
      amount: Number(data?.amount ?? 0),
      paymentDate: String(data?.paymentDate ?? new Date().toISOString().slice(0, 10)),
      paymentMethod: data?.paymentMethod as Payment['paymentMethod'] ?? 'Cash',
      status: data?.status as Payment['status'] ?? 'Paid',
      remarks: String(data?.remarks ?? '')
    };
    db.payments.unshift(payment);
    log('Recorded payment', 'Payments', payment.candidateId, `${payment.paymentType} recorded against ${payment.candidateId}.`);
    return payment;
  },
  updatePayment: ({ id, data }) => {
    const payment = db.payments.find((p) => p.id === id) ?? notFound('Payment', id);
    Object.assign(payment, data);
    log('Updated payment', 'Payments', payment.id, `Payment ${payment.id} updated.`);
    return payment;
  },
  deletePayment: ({ id }) => {
    const index = db.payments.findIndex((p) => p.id === id);
    if (index < 0) notFound('Payment', id);
    db.payments.splice(index, 1);
    log('Deleted payment', 'Payments', String(id), `Payment ${id} removed.`);
    return { id };
  },

  /* documents */
  getDocuments: ({ params = {} }) => {
    const items = db.documents.filter(
      (doc) =>
      matchesSearch(doc, ['id', 'title', 'fileName', 'documentUrl', 'candidateId', 'candidateName'], str(params, 'search')) &&
      matchesEquals(doc, 'type', str(params, 'type')) &&
      matchesEquals(doc, 'status', str(params, 'status')) &&
      matchesEquals(doc, 'candidateId', str(params, 'candidateId'))
    );
    return paginate(
      sortItems(items, str(params, 'sortBy') ?? 'uploadedDate', str(params, 'sortDir') as 'asc' | 'desc' ?? 'desc'),
      num(params, 'page', 1),
      num(params, 'pageSize', 10)
    );
  },
  uploadDocument: ({ data }) => {
    const candidate = db.candidates.find((c) => c.id === data?.candidateId);
    const title = String(data?.title ?? data?.fileName ?? 'Document Link');
    const record: DocumentRecord = {
      id: nextId('DOC', db.documents, 4),
      title,
      fileName: title,
      documentUrl: String(data?.documentUrl ?? 'https://drive.google.com'),
      candidateId: String(data?.candidateId ?? ''),
      candidateName: candidate?.fullName ?? '—',
      type: data?.type as DocumentRecord['type'] ?? 'Other',
      status: 'Uploaded',
      uploadedDate: new Date().toISOString().slice(0, 10),
      sizeKb: Number(data?.sizeKb ?? 0),
      driveFileId: `drive-${pad(db.documents.length + 1, 6)}`
    };
    db.documents.unshift(record);
    log('Added document', 'Documents', record.candidateId, `${record.title} added for ${record.candidateId}.`);
    return record;
  },
  updateDocumentStatus: ({ id, data }) => {
    const doc = db.documents.find((d) => d.id === id) ?? notFound('Document', id);
    doc.status = data?.status as DocumentRecord['status'];
    log('Updated document', 'Documents', doc.candidateId, `${doc.title || doc.type} for ${doc.candidateId} marked ${doc.status}.`);
    return doc;
  },
  deleteDocument: ({ id }) => {
    const index = db.documents.findIndex((d) => d.id === id);
    if (index < 0) notFound('Document', id);
    const [removed] = db.documents.splice(index, 1);
    log('Deleted document', 'Documents', removed.candidateId, `${removed.title || removed.fileName} deleted.`);
    return { id };
  },

  /* users */
  getUsers: ({ params = {} }) => {
    const items = db.users.filter(
      (user) =>
      matchesSearch(user, ['name', 'email', 'id'], str(params, 'search')) &&
      matchesEquals(user, 'role', str(params, 'role')) &&
      matchesEquals(user, 'status', str(params, 'status'))
    );
    return paginate(
      sortItems(items, str(params, 'sortBy') ?? 'name', str(params, 'sortDir') as 'asc' | 'desc' ?? 'asc'),
      num(params, 'page', 1),
      num(params, 'pageSize', 10)
    );
  },
  addUser: ({ data }) => {
    const user: UserAccount = {
      id: nextId('USR', db.users, 3),
      name: String(data?.name ?? ''),
      email: String(data?.email ?? ''),
      role: data?.role as UserAccount['role'] ?? 'Viewer',
      status: data?.status as UserAccount['status'] ?? 'Active',
      lastLogin: '',
      createdDate: new Date().toISOString().slice(0, 10)
    };
    db.users.push(user);
    log('Added user', 'Users', user.id, `User ${user.name} created with the ${user.role} role.`);
    return user;
  },
  updateUser: ({ id, data }) => {
    const user = db.users.find((u) => u.id === id) ?? notFound('User', id);
    Object.assign(user, data);
    log('Updated user', 'Users', user.id, `User ${user.name} updated.`);
    return user;
  },
  deleteUser: ({ id }) => {
    const index = db.users.findIndex((u) => u.id === id);
    if (index < 0) notFound('User', id);
    const [removed] = db.users.splice(index, 1);
    log('Removed user', 'Users', removed.id, `User ${removed.name} removed.`);
    return { id };
  },

  /* activity */
  getActivity: ({ params = {} }) => {
    const items = db.activity.filter(
      (entry) =>
      matchesSearch(entry, ['action', 'details', 'record', 'user'], str(params, 'search')) &&
      matchesEquals(entry, 'user', str(params, 'user')) &&
      matchesEquals(entry, 'module', str(params, 'module')) &&
      matchesEquals(entry, 'action', str(params, 'action')) &&
      withinDateRange(entry.timestamp.slice(0, 10), str(params, 'dateFrom'), str(params, 'dateTo'))
    );
    return paginate(items, num(params, 'page', 1), num(params, 'pageSize', 15));
  }
};

/**
 * Emulates the Google Apps Script `doGet`/`doPost` router. Every request is a
 * single `{ action, id, data, params }` envelope, exactly like the real backend.
 */
export function handleMockRequest(request: ApiRequest): unknown {
  const handler = handlers[request.action];
  if (!handler) throw new Error(`Unknown action: ${request.action}`);
  return handler(request);
}