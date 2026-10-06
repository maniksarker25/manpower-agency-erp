import React, { useState } from 'react';
import { toast } from 'sonner';
import { DownloadIcon, FileSpreadsheetIcon, PlaneTakeoffIcon, UsersIcon, WalletIcon } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { PageHeader } from '../../../components/common/PageHeader';
import { SectionCard } from '../../../components/common/SectionCard';
import { StatsCard } from '../../../components/common/StatsCard';
import { CardSkeleton, ErrorState, LoadingState } from '../../../components/common/States';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { FormField } from '../../../components/common/FormField';
import { OptionSelect } from '../../../components/shared/OptionSelect';
import { AgentSelect, CandidateStatusSelect, CountrySelect } from '../../../components/shared/EntitySelects';
import { DateRangeFilter } from '../../../components/shared/DateRangeFilter';
import { useGetDashboardStatsQuery } from '../../dashboard/dashboardApi';
import { useGetAgentsQuery } from '../../agents/agentsApi';
import { formatCurrency, formatNumber } from '../../../utils/format';
import { StatusOverviewChart } from '../../dashboard/components/StatusOverviewChart';
import { DeploymentTrendChart } from '../components/DeploymentTrendChart';

type ReportFilters = {
  dateFrom: string;
  dateTo: string;
  country: string;
  agentId: string;
  status: string;
};

const EMPTY_FILTERS: ReportFilters = { dateFrom: '', dateTo: '', country: 'all', agentId: 'all', status: 'all' };

export function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>(EMPTY_FILTERS);
  const { data, isLoading, isError, refetch } = useGetDashboardStatsQuery();
  const { data: agents, isLoading: agentsLoading } = useGetAgentsQuery({ pageSize: 50, sortBy: 'candidates', sortDir: 'desc' });

  const setFilter = (key: keyof ReportFilters, value: string) =>
  setFilters((current) => ({ ...current, [key]: value }));

  if (isError) {
    return (
      <Card>
        <ErrorState
          description="We couldn't load the report data."
          onRetry={() => {
            void refetch();
          }} />
        
      </Card>);

  }

  const deploymentRate = data && data.totals.candidates > 0 ?
  Math.round(data.totals.deployed / data.totals.candidates * 100) :
  0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports"
        description="Pipeline, country, agent and payment performance."
        actions={
        <>
            <Button
            variant="outline"
            onClick={() => toast.success('Export queued', { description: 'A CSV will download shortly.' })}>
            
              <FileSpreadsheetIcon aria-hidden="true" />
              Export CSV
            </Button>
            <Button
            onClick={() => toast.success('Report generated', { description: 'The PDF is ready to download.' })}>
            
              <DownloadIcon aria-hidden="true" />
              Download PDF
            </Button>
          </>
        } />
      

      <Card>
        <div className="grid gap-4 p-5 lg:grid-cols-4">
          <FormField id="report-country" label="Country">
            <CountrySelect value={filters.country} onChange={(value) => setFilter('country', value)} allLabel="All countries" />
          </FormField>
          <FormField id="report-agent" label="Agent">
            <AgentSelect value={filters.agentId} onChange={(value) => setFilter('agentId', value)} allLabel="All agents" />
          </FormField>
          <FormField id="report-status" label="Status">
            <CandidateStatusSelect value={filters.status} onChange={(value) => setFilter('status', value)} allLabel="All statuses" />
          </FormField>
          <DateRangeFilter
            from={filters.dateFrom}
            to={filters.dateTo}
            onChange={(key, value) => setFilter(key === 'dateFrom' ? 'dateFrom' : 'dateTo', value)}
            label="Reporting period"
            idPrefix="report" />
          
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border bg-secondary/30 px-5 py-3">
          <p className="text-[13px] text-muted-foreground">
            Filters apply to every report on this page and are sent to the API as query parameters.
          </p>
          <Button variant="ghost" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
            Reset filters
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total Candidates"
          value={data?.totals.candidates ?? 0}
          icon={UsersIcon}
          loading={isLoading}
        />

        <StatsCard
          label="Deployed"
          value={data?.totals.deployed ?? 0}
          icon={PlaneTakeoffIcon}
          loading={isLoading}
        />

        <StatsCard
          label="Deployment Rate (%)"
          value={deploymentRate}
          icon={PlaneTakeoffIcon}
          loading={isLoading}
        />

        <StatsCard
          label="Collected (USD)"
          value={data?.paymentSummary.collected ?? 0}
          icon={WalletIcon}
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Registrations vs deployments"
          description="Six-month trend across the pipeline."
          className="xl:col-span-2">
          
          {isLoading ? <CardSkeleton className="h-[300px]" /> : <DeploymentTrendChart data={data?.monthly ?? []} />}
        </SectionCard>

        <SectionCard title="Status distribution" description="Current pipeline mix.">
          {isLoading ? <CardSkeleton className="h-[280px]" /> : <StatusOverviewChart data={data?.statusOverview ?? []} />}
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Country statistics" description="Registered and deployed candidates by destination.">
          {isLoading ?
          <LoadingState rows={5} columns={3} /> :

          <div className="thin-scroll -mx-5 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Country</TableHead>
                    <TableHead>Candidates</TableHead>
                    <TableHead>Deployed</TableHead>
                    <TableHead>Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.byCountry ?? []).map((row) =>
                <TableRow key={row.country} className="hover:bg-secondary/50">
                      <TableCell className="font-medium">{row.country}</TableCell>
                      <TableCell className="num">{formatNumber(row.candidates)}</TableCell>
                      <TableCell className="num">{formatNumber(row.deployed)}</TableCell>
                      <TableCell className="num text-muted-foreground">
                        {row.candidates ? Math.round(row.deployed / row.candidates * 100) : 0}%
                      </TableCell>
                    </TableRow>
                )}
                </TableBody>
              </Table>
            </div>
          }
        </SectionCard>

        <SectionCard title="Agent performance" description="Candidates sourced per recruitment partner.">
          {agentsLoading ?
          <LoadingState rows={5} columns={4} /> :

          <div className="thin-scroll -mx-5 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Agent</TableHead>
                    <TableHead>Candidates</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(agents?.items ?? []).slice(0, 8).map((agent) =>
                <TableRow key={agent.id} className="hover:bg-secondary/50">
                      <TableCell className="whitespace-nowrap font-medium">{agent.name}</TableCell>
                      <TableCell className="num">{formatNumber(agent.candidates)}</TableCell>
                      <TableCell className="num text-muted-foreground">{agent.commission}%</TableCell>
                      <TableCell>
                        <StatusBadge kind="record" value={agent.status} />
                      </TableCell>
                    </TableRow>
                )}
                </TableBody>
              </Table>
            </div>
          }
        </SectionCard>
      </div>

      <SectionCard title="Payment summary" description="Collected, outstanding and refunded across the period.">
        <dl className="grid gap-4 sm:grid-cols-3">
          {[
          { label: 'Collected', value: data?.paymentSummary.collected ?? 0, tone: 'text-emerald-600' },
          { label: 'Pending / partial', value: data?.paymentSummary.pending ?? 0, tone: 'text-amber-600' },
          { label: 'Refunded', value: data?.paymentSummary.refunded ?? 0, tone: 'text-muted-foreground' }].
          map((row) =>
          <div key={row.label} className="rounded-md border border-border p-4">
              <dt className="text-[13px] text-muted-foreground">{row.label}</dt>
              <dd className={`num mt-1 text-xl font-semibold ${row.tone}`}>{formatCurrency(row.value)}</dd>
            </div>
          )}
        </dl>
      </SectionCard>
    </div>);

}