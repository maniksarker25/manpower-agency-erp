import type { Agent } from '../types/models';
import { daysAgo } from './seed';

export const agents: Agent[] = [
{ id: 'AGT-001', name: 'Rahim Enterprise', mobile: '+880 1711 234567', address: 'Motijheel, Dhaka', commission: 8, status: 'Active', candidates: 0, createdDate: daysAgo(400) },
{ id: 'AGT-002', name: 'Global Manpower Link', mobile: '+880 1811 345678', address: 'Banani, Dhaka', commission: 10, status: 'Active', candidates: 0, createdDate: daysAgo(365) },
{ id: 'AGT-003', name: 'Karim Overseas', mobile: '+880 1911 456789', address: 'Agrabad, Chattogram', commission: 7.5, status: 'Active', candidates: 0, createdDate: daysAgo(330) },
{ id: 'AGT-004', name: 'Meridian Recruiters', mobile: '+880 1611 567890', address: 'Uttara, Dhaka', commission: 9, status: 'Active', candidates: 0, createdDate: daysAgo(290) },
{ id: 'AGT-005', name: 'Al-Amin Travels', mobile: '+880 1511 678901', address: 'Sylhet Sadar, Sylhet', commission: 6, status: 'Inactive', candidates: 0, createdDate: daysAgo(240) },
{ id: 'AGT-006', name: 'Nabila Consultancy', mobile: '+880 1311 789012', address: 'Khulna Sadar, Khulna', commission: 8.5, status: 'Active', candidates: 0, createdDate: daysAgo(180) },
{ id: 'AGT-007', name: 'Shahid Manpower', mobile: '+880 1411 890123', address: 'Rajshahi Sadar, Rajshahi', commission: 7, status: 'Active', candidates: 0, createdDate: daysAgo(120) },
{ id: 'AGT-008', name: 'Bright Future BD', mobile: '+880 1211 901234', address: 'Mirpur, Dhaka', commission: 11, status: 'Active', candidates: 0, createdDate: daysAgo(60) }];