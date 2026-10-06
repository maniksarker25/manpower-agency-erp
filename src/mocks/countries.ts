import type { Country } from '../types/models';
import { daysAgo } from './seed';

export const countries: Country[] = [
{ id: 'CTR-001', name: 'Saudi Arabia', code: 'SA', status: 'Active', candidates: 0, createdDate: daysAgo(420) },
{ id: 'CTR-002', name: 'United Arab Emirates', code: 'AE', status: 'Active', candidates: 0, createdDate: daysAgo(410) },
{ id: 'CTR-003', name: 'Qatar', code: 'QA', status: 'Active', candidates: 0, createdDate: daysAgo(395) },
{ id: 'CTR-004', name: 'Kuwait', code: 'KW', status: 'Active', candidates: 0, createdDate: daysAgo(380) },
{ id: 'CTR-005', name: 'Oman', code: 'OM', status: 'Active', candidates: 0, createdDate: daysAgo(360) },
{ id: 'CTR-006', name: 'Malaysia', code: 'MY', status: 'Active', candidates: 0, createdDate: daysAgo(320) },
{ id: 'CTR-007', name: 'Singapore', code: 'SG', status: 'Active', candidates: 0, createdDate: daysAgo(300) },
{ id: 'CTR-008', name: 'Bahrain', code: 'BH', status: 'Active', candidates: 0, createdDate: daysAgo(260) },
{ id: 'CTR-009', name: 'Jordan', code: 'JO', status: 'Inactive', candidates: 0, createdDate: daysAgo(210) },
{ id: 'CTR-010', name: 'Romania', code: 'RO', status: 'Active', candidates: 0, createdDate: daysAgo(120) }];


export const activeCountryNames = countries.
filter((c) => c.status === 'Active').
map((c) => c.name);