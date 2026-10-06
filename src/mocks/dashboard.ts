import type { Candidate, CandidateStatus, DashboardStats } from '../types/models';
import { CANDIDATE_STATUSES } from '../constants/options';
import { activity } from './activity';
import { payments } from './payments';

const MONTH_LABELS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

const CHANGES: Record<string, number> = {
  candidates: 12.5,
  new: 8.2,
  processing: 4.1,
  selected: 6.7,
  visaProcessing: -2.4,
  deployed: 15.3,
  rejected: -3.8
};

function countBy(list: Candidate[], status: CandidateStatus): number {
  return list.filter((candidate) => candidate.status === status).length;
}

/** Derives the dashboard payload from the candidate/payment/activity mocks. */
export function buildDashboardStats(candidateList: Candidate[]): DashboardStats {
  const countryMap = new Map<string, {candidates: number;deployed: number;}>();
  candidateList.forEach((candidate) => {
    const entry = countryMap.get(candidate.country) ?? { candidates: 0, deployed: 0 };
    entry.candidates += 1;
    if (candidate.status === 'Deployed') entry.deployed += 1;
    countryMap.set(candidate.country, entry);
  });

  const monthly = MONTH_LABELS.map((month, index) => ({
    month,
    registered: 28 + index * 6 + (index % 2 === 0 ? 5 : -3),
    deployed: 12 + index * 4 + (index % 3 === 0 ? 3 : -2)
  }));

  return {
    totals: {
      candidates: candidateList.length,
      new: countBy(candidateList, 'New'),
      processing: countBy(candidateList, 'Processing'),
      selected: countBy(candidateList, 'Selected'),
      visaProcessing: countBy(candidateList, 'Visa Processing'),
      deployed: countBy(candidateList, 'Deployed'),
      rejected: countBy(candidateList, 'Rejected')
    },
    changes: CHANGES,
    statusOverview: CANDIDATE_STATUSES.map((status) => ({
      status,
      count: countBy(candidateList, status)
    })),
    byCountry: [...countryMap.entries()].
    map(([country, value]) => ({ country, ...value })).
    sort((a, b) => b.candidates - a.candidates),
    monthly,
    recentCandidates: candidateList.slice(0, 6),
    recentActivity: activity.slice(0, 6),
    paymentSummary: {
      collected: payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0),
      pending: payments.
      filter((p) => p.status === 'Pending' || p.status === 'Partial').
      reduce((sum, p) => sum + p.amount, 0),
      refunded: payments.filter((p) => p.status === 'Refunded').reduce((sum, p) => sum + p.amount, 0)
    }
  };
}