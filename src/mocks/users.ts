import type { UserAccount } from '../types/models';
import { daysAgo, hoursAgo } from './seed';

export const users: UserAccount[] = [
{ id: 'USR-001', name: 'Ahsan Habib', email: 'admin@meridianmanpower.com', role: 'Admin', status: 'Active', lastLogin: hoursAgo(2), createdDate: daysAgo(420) },
{ id: 'USR-002', name: 'Nadia Karim', email: 'nadia.karim@meridianmanpower.com', role: 'Manager', status: 'Active', lastLogin: hoursAgo(9), createdDate: daysAgo(360) },
{ id: 'USR-003', name: 'Tanvir Alam', email: 'tanvir.alam@meridianmanpower.com', role: 'Data Entry', status: 'Active', lastLogin: hoursAgo(26), createdDate: daysAgo(240) },
{ id: 'USR-004', name: 'Rumana Akter', email: 'rumana.akter@meridianmanpower.com', role: 'Data Entry', status: 'Active', lastLogin: hoursAgo(51), createdDate: daysAgo(210) },
{ id: 'USR-005', name: 'Imran Hossain', email: 'imran.hossain@meridianmanpower.com', role: 'Manager', status: 'Inactive', lastLogin: hoursAgo(720), createdDate: daysAgo(180) },
{ id: 'USR-006', name: 'Farhana Yasmin', email: 'farhana.yasmin@meridianmanpower.com', role: 'Viewer', status: 'Active', lastLogin: hoursAgo(120), createdDate: daysAgo(90) },
{ id: 'USR-007', name: 'Sajid Rahman', email: 'sajid.rahman@meridianmanpower.com', role: 'Viewer', status: 'Active', lastLogin: hoursAgo(310), createdDate: daysAgo(45) }];


/** The signed-in account used by the mock auth flow. */
export const currentUser = users[0];