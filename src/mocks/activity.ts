import type { ActivityEntry } from '../types/models';
import { candidates } from './candidates';
import { createRng, hoursAgo, intBetween, pad, pick } from './seed';
import { users } from './users';

const TEMPLATES: {action: string;module: string;details: (record: string) => string;}[] = [
{ action: 'Created candidate', module: 'Candidates', details: (r) => `New candidate ${r} registered.` },
{ action: 'Updated candidate status', module: 'Candidates', details: (r) => `Status of ${r} changed to Processing.` },
{ action: 'Uploaded document', module: 'Documents', details: (r) => `Passport uploaded for ${r}.` },
{ action: 'Verified document', module: 'Documents', details: (r) => `Medical report verified for ${r}.` },
{ action: 'Recorded payment', module: 'Payments', details: (r) => `Service charge recorded against ${r}.` },
{ action: 'Added agent', module: 'Agents', details: () => 'Agent Bright Future BD added to the network.' },
{ action: 'Updated country', module: 'Countries', details: () => 'Romania marked as Active.' },
{ action: 'Changed user role', module: 'Users', details: () => 'Tanvir Alam role changed to Data Entry.' },
{ action: 'Updated settings', module: 'Settings', details: () => 'Job position list updated.' },
{ action: 'Signed in', module: 'Auth', details: () => 'Successful sign-in from Dhaka, BD.' }];


function buildActivity(count: number): ActivityEntry[] {
  const rng = createRng(99331);
  const list: ActivityEntry[] = [];

  for (let i = 1; i <= count; i += 1) {
    const template = pick(rng, TEMPLATES);
    const candidate = pick(rng, candidates);
    const record = template.module === 'Candidates' || template.module === 'Documents' || template.module === 'Payments' ?
    candidate.id :
    '—';

    list.push({
      id: `ACT-${pad(i, 5)}`,
      timestamp: hoursAgo(i * intBetween(rng, 1, 4)),
      user: pick(rng, users).name,
      action: template.action,
      module: template.module,
      record,
      details: template.details(record)
    });
  }

  return list;
}

export const activity: ActivityEntry[] = buildActivity(80);