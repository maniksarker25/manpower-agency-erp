import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';

interface DeploymentTrendChartProps {
  data: {month: string;registered: number;deployed: number;}[];
}

export function DeploymentTrendChart({ data }: DeploymentTrendChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false} />
          
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 13,
              boxShadow: '0 4px 12px -2px rgb(16 24 40 / 0.08)'
            }} />
          
          <Legend
            verticalAlign="top"
            align="right"
            height={28}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
          
          <Line
            type="monotone"
            dataKey="registered"
            name="Registered"
            stroke="#1e3a8a"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }} />
          
          <Line
            type="monotone"
            dataKey="deployed"
            name="Deployed"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }} />
          
        </LineChart>
      </ResponsiveContainer>
    </div>);

}