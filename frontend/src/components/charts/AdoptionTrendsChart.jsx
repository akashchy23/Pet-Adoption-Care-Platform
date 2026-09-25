import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const AdoptionTrendsChart = ({ data = [] }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="adoptionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="inquiryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '12px',
              border: 'none',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Area
            type="monotone"
            dataKey="adoptions"
            name="Finalized Adoptions"
            stroke="#0d9488"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#adoptionGradient)"
          />
          <Area
            type="monotone"
            dataKey="inquiries"
            name="Application Inquiries"
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#inquiryGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
