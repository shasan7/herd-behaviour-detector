import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload }) =>
  active && payload && payload.length ? (
    <div className="bg-white shadow rounded p-2 text-xs border">
      <p>{payload[0].payload.minute}</p>
      <p className="font-semibold text-blue-600">
        {payload[0].value} views/min
      </p>
    </div>
  ) : null;

export default function TrendChart({ data }) {
  if (!data || data.length === 0) return <p className="text-xs">No data</p>;

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="minute" hide />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#2563eb"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorView)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
