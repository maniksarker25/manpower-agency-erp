import React from 'react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  DownloadIcon,
  FileCheckIcon,
  PlaneTakeoffIcon,
  StampIcon,
  UserPlusIcon,
  UsersIcon,
  XCircleIcon
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { PageHeader } from '../../../components/common/PageHeader';
import { SectionCard } from '../../../components/common/SectionCard';
import { StatsCard } from '../../../components/common/StatsCard';
import { CardSkeleton, ErrorState } from '../../../components/common/States';
import { useAuth } from '../../../hooks/useAuth';
import { formatCurrency } from '../../../utils/format';
import { useGetDashboardStatsQuery } from '../dashboardApi';
import { CountryDistribution } from '../components/CountryDistribution';
import { RecentCandidates } from '../components/RecentCandidates';
import { StatusOverviewChart } from '../components/StatusOverviewChart';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useGetDashboardStatsQuery();

  const secondaryKpis = [
    { label: 'New', value: data?.totals.new ?? 0, icon: UserPlusIcon },
    { label: 'Processing', value: data?.totals.processing ?? 0, icon: ClockIcon },
    { label: 'Selected', value: data?.totals.selected ?? 0, icon: FileCheckIcon },
    {
      label: 'Visa Processing',
      value: data?.totals.visaProcessing ?? 0,
      icon: StampIcon
    },
    { label: 'Deployed', value: data?.totals.deployed ?? 0, icon: PlaneTakeoffIcon },
    { label: 'Rejected', value: data?.totals.rejected ?? 0, icon: XCircleIcon }
  ];

  if (isError) {
    return (
      <Card>
        <ErrorState
          description="We couldn't load your dashboard data."
          onRetry={() => {
            void refetch();
          }}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting()}, ${user?.name.split(' ')[0] ?? 'Admin'}`}
        description="Here's what's happening with your manpower agency today."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/reports">
                <DownloadIcon aria-hidden="true" />
                Reports
              </Link>
            </Button>
            <Button asChild>
              <Link to="/candidates/new">
                <UserPlusIcon aria-hidden="true" />
                Add Candidate
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <StatsCard
          label="Total Candidates"
          value={data?.totals.candidates ?? 0}
          icon={UsersIcon}
          emphasis
          loading={isLoading}
          className="lg:col-span-1"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
          {secondaryKpis.map((kpi) => (
            <StatsCard key={kpi.label} {...kpi} loading={isLoading} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Candidate Status Overview"
          description="Where every active candidate sits in the pipeline."
          className="xl:col-span-2"
        >
          {isLoading ? <CardSkeleton className="h-[280px]" /> : <StatusOverviewChart data={data?.statusOverview ?? []} />}
        </SectionCard>

        <SectionCard
          title="Candidates by Country"
          description="Top destinations by registered candidates."
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/countries">Manage</Link>
            </Button>
          }
        >
          {isLoading ? <CardSkeleton /> : <CountryDistribution data={data?.byCountry ?? []} />}
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Recent Candidates"
          description="The six most recent registrations."
          className="xl:col-span-2"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/candidates">View all</Link>
            </Button>
          }
        >
          {isLoading ? <CardSkeleton /> : <RecentCandidates candidates={data?.recentCandidates ?? []} />}
        </SectionCard>

        <SectionCard title="Payment Summary" description="Overview of payments and collections.">
          <dl className="space-y-3">
            {[
              { label: 'Collected', value: data?.paymentSummary.collected ?? 0, tone: 'text-emerald-600' },
              { label: 'Pending', value: data?.paymentSummary.pending ?? 0, tone: 'text-amber-600' },
              { label: 'Refunded', value: data?.paymentSummary.refunded ?? 0, tone: 'text-muted-foreground' }
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <dt className="text-[13px] text-muted-foreground">{row.label}</dt>
                <dd className={`num text-sm font-semibold ${row.tone}`}>{formatCurrency(row.value)}</dd>
              </div>
            ))}
          </dl>
        </SectionCard>
      </div>
    </div>
  );
}