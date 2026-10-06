import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute';

/** Route-level code splitting — every screen is its own chunk. */
const LoginPage = lazy(() =>
import('../../features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const DashboardPage = lazy(() =>
import('../../features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const CandidatesPage = lazy(() =>
import('../../features/candidates/pages/CandidatesPage').then((m) => ({ default: m.CandidatesPage }))
);
const CandidateFormPage = lazy(() =>
import('../../features/candidates/pages/CandidateFormPage').then((m) => ({
  default: m.CandidateFormPage
}))
);
const CandidateDetailsPage = lazy(() =>
import('../../features/candidates/pages/CandidateDetailsPage').then((m) => ({
  default: m.CandidateDetailsPage
}))
);
const AgentsPage = lazy(() =>
import('../../features/agents/pages/AgentsPage').then((m) => ({ default: m.AgentsPage }))
);
const CountriesPage = lazy(() =>
import('../../features/countries/pages/CountriesPage').then((m) => ({ default: m.CountriesPage }))
);
const PaymentsPage = lazy(() =>
import('../../features/payments/pages/PaymentsPage').then((m) => ({ default: m.PaymentsPage }))
);
const DocumentsPage = lazy(() =>
import('../../features/documents/pages/DocumentsPage').then((m) => ({ default: m.DocumentsPage }))
);
const ReportsPage = lazy(() =>
import('../../features/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);
const UsersPage = lazy(() =>
import('../../features/users/pages/UsersPage').then((m) => ({ default: m.UsersPage }))
);
const ActivityLogPage = lazy(() =>
import('../../features/activity-log/pages/ActivityLogPage').then((m) => ({
  default: m.ActivityLogPage
}))
);
const SettingsPage = lazy(() =>
import('../../features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const ProfilePage = lazy(() =>
import('../../features/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const NotificationsPage = lazy(() =>
import('../../features/notifications/pages/NotificationsPage').then((m) => ({
  default: m.NotificationsPage
}))
);
const NotFoundPage = lazy(() =>
import('../../components/common/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/candidates/new" element={<CandidateFormPage mode="create" />} />
          <Route path="/candidates/:id" element={<CandidateDetailsPage />} />
          <Route path="/candidates/:id/edit" element={<CandidateFormPage mode="edit" />} />

          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/users" element={<Navigate to="/dashboard" replace />} />
          <Route path="/activity-log" element={<Navigate to="/dashboard" replace />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>);

}