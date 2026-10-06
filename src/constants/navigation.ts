import {
  ActivityIcon,
  BuildingIcon,
  CreditCardIcon,
  FileTextIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  PieChartIcon,
  SettingsIcon,
  UserPlusIcon,
  UsersIcon,
  UserCogIcon,
  type LucideIcon } from
'lucide-react';

export interface NavChild {
  label: string;
  to: string;
}

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  children?: NavChild[];
  /** Section label rendered above the item when it starts a new group. */
  group?: string;
}

export const NAV_ITEMS: NavItem[] = [
{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboardIcon, group: 'Overview' },
{
  label: 'Candidates',
  to: '/candidates',
  icon: UsersIcon,
  group: 'Recruitment',
  children: [
  { label: 'All Candidates', to: '/candidates' },
  { label: 'Add Candidate', to: '/candidates/new' }]

},
{ label: 'Agents', to: '/agents', icon: BuildingIcon },
{ label: 'Countries', to: '/countries', icon: GlobeIcon },
{ label: 'Payments', to: '/payments', icon: CreditCardIcon, group: 'Operations' },
{ label: 'Documents', to: '/documents', icon: FileTextIcon },
{ label: 'Reports', to: '/reports', icon: PieChartIcon },
{ label: 'Settings', to: '/settings', icon: SettingsIcon, group: 'Administration' }];


export const ADD_CANDIDATE_ICON = UserPlusIcon;

/** Route → breadcrumb label map. Dynamic segments are resolved at render time. */
export const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  candidates: 'Candidates',
  new: 'Add Candidate',
  edit: 'Edit',
  agents: 'Agents',
  countries: 'Countries',
  payments: 'Payments',
  documents: 'Documents',
  reports: 'Reports',
  users: 'Users',
  'activity-log': 'Activity Log',
  settings: 'Settings',
  profile: 'Profile',
  notifications: 'Notifications'
};