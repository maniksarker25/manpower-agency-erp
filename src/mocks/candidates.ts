import type { Candidate, CandidateStatus, Gender } from '../types/models';
import { JOB_POSITIONS } from '../constants/options';
import { agents } from './agents';
import { activeCountryNames } from './countries';
import { createRng, daysAgo, intBetween, pad, pick } from './seed';

const FIRST_NAMES = [
'Abdul', 'Mohammad', 'Rafiq', 'Jahangir', 'Nasir', 'Shahin', 'Kamrul', 'Selim',
'Ruhul', 'Ayesha', 'Nasrin', 'Fatema', 'Rokeya', 'Sumon', 'Milon', 'Habib',
'Rasel', 'Jamal', 'Ilias', 'Tanvir', 'Sabina', 'Momtaz', 'Anwar', 'Faruk'];


const LAST_NAMES = [
'Hossain', 'Islam', 'Rahman', 'Ahmed', 'Chowdhury', 'Miah', 'Khan', 'Uddin',
'Sarker', 'Akter', 'Begum', 'Sheikh', 'Mollah', 'Talukder', 'Bhuiyan'];


const STATUS_WEIGHTS: CandidateStatus[] = [
'New', 'New', 'New',
'Processing', 'Processing', 'Processing', 'Processing',
'Selected', 'Selected',
'Visa Processing', 'Visa Processing',
'Deployed', 'Deployed', 'Deployed',
'Rejected'];


const REMARKS = [
'Medical completed, waiting for embassy appointment.',
'Documents verified by the agent. Awaiting employer approval.',
'Second interview scheduled with the employer.',
'Passport renewal in progress.',
'Candidate requested a deployment date after Ramadan.',
''];


function buildCandidates(count: number): Candidate[] {
  const rng = createRng(20240915);
  const list: Candidate[] = [];

  for (let i = 1; i <= count; i += 1) {
    const first = pick(rng, FIRST_NAMES);
    const last = pick(rng, LAST_NAMES);
    const agent = pick(rng, agents);
    const gender: Gender = rng() > 0.22 ? 'Male' : 'Female';
    const registeredDaysAgo = intBetween(rng, 1, 300);

    list.push({
      id: `CAN-${pad(i)}`,
      registrationDate: daysAgo(registeredDaysAgo),
      fullName: `${first} ${last}`,
      mobile: `+880 1${intBetween(rng, 3, 9)}${intBetween(rng, 10, 99)} ${intBetween(rng, 100000, 999999)}`,
      passportNo: `BX${intBetween(rng, 1000000, 9999999)}`,
      dateOfBirth: `19${intBetween(rng, 82, 99)}-${pad(intBetween(rng, 1, 12), 2)}-${pad(intBetween(rng, 1, 28), 2)}`,
      gender,
      country: pick(rng, activeCountryNames),
      jobPosition: pick(rng, JOB_POSITIONS),
      salary: intBetween(rng, 4, 18) * 100,
      agentId: agent.id,
      agentName: agent.name,
      status: pick(rng, STATUS_WEIGHTS),
      remarks: pick(rng, REMARKS),
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      address: `House ${intBetween(rng, 1, 90)}, Road ${intBetween(rng, 1, 25)}, Dhaka`
    });
  }

  return list.sort((a, b) => b.registrationDate.localeCompare(a.registrationDate));
}

export const candidates: Candidate[] = buildCandidates(96);