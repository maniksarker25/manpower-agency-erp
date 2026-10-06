import type { DocumentRecord } from '../types/models';
import { DOCUMENT_STATUSES, DOCUMENT_TYPES } from '../constants/options';
import { candidates } from './candidates';
import { createRng, daysAgo, intBetween, pad, pick } from './seed';

const EXTENSIONS: Record<string, string> = {
  Photo: 'jpg',
  CV: 'pdf',
  Passport: 'pdf',
  NID: 'pdf',
  Medical: 'pdf',
  BMET: 'pdf',
  Visa: 'pdf',
  Ticket: 'pdf',
  Other: 'pdf'
};

function buildDocuments(count: number): DocumentRecord[] {
  const rng = createRng(551277);
  const list: DocumentRecord[] = [];

  for (let i = 1; i <= count; i += 1) {
    const candidate = pick(rng, candidates);
    const type = pick(rng, DOCUMENT_TYPES);
    const status = pick(rng, DOCUMENT_STATUSES);

    list.push({
      id: `DOC-${pad(i, 4)}`,
      title: `${candidate.fullName} - ${type}`,
      fileName: `${candidate.id}-${type.toLowerCase()}.${EXTENSIONS[type]}`,
      documentUrl: `https://drive.google.com/file/d/1${pad(i * 37, 8)}/view`,
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      type,
      status,
      uploadedDate: daysAgo(intBetween(rng, 0, 150)),
      sizeKb: intBetween(rng, 120, 4800),
      driveFileId: status === 'Pending' ? undefined : `drive-${pad(i, 6)}`
    });
  }

  return list.sort((a, b) => b.uploadedDate.localeCompare(a.uploadedDate));
}

export const documents: DocumentRecord[] = buildDocuments(64);