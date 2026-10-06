import type { Payment } from '../types/models';
import { PAYMENT_METHODS, PAYMENT_STATUSES, PAYMENT_TYPES } from '../constants/options';
import { candidates } from './candidates';
import { createRng, daysAgo, intBetween, pad, pick } from './seed';

function buildPayments(count: number): Payment[] {
  const rng = createRng(778812);
  const list: Payment[] = [];

  for (let i = 1; i <= count; i += 1) {
    const candidate = pick(rng, candidates);
    list.push({
      id: `PAY-${pad(i, 4)}`,
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      paymentType: pick(rng, PAYMENT_TYPES),
      amount: intBetween(rng, 1, 30) * 50,
      paymentDate: daysAgo(intBetween(rng, 0, 180)),
      paymentMethod: pick(rng, PAYMENT_METHODS),
      status: pick(rng, PAYMENT_STATUSES),
      remarks: rng() > 0.6 ? 'Received at the Dhaka office counter.' : ''
    });
  }

  return list.sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));
}

export const payments: Payment[] = buildPayments(72);