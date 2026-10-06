import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { CANDIDATE_STATUS_CHART_COLORS } from '../../../constants/statusConfig';
import type { CandidateStatus } from '../../../types/models';

interface StatusOverviewChartProps {
  data: {status: CandidateStatus;count: number;}[];
}

export function StatusOverviewChart({ data }: StatusOverviewChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }} barCategoryGap="28%">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="status"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
            interval={0}
            tickFormatter={(value: string) => value === 'Visa Processing' ? 'Visa' : value} />
          
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            cursor={{ fill: 'rgba(15,23,42,0.04)' }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 13,
              boxShadow: '0 4px 12px -2px rgb(16 24 40 / 0.08)'
            }}
            formatter={(value: number) => [`${value} candidates`, '']} />
          
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={64}>
            {data.map((entry) =>
            <Cell key={entry.status} fill={CANDIDATE_STATUS_CHART_COLORS[entry.status]} />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>);

}