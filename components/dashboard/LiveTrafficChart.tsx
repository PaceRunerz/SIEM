import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface DataPoint {
  time: string;
  eps: number;
}

interface LiveTrafficChartProps {
  data: DataPoint[];
}

export const LiveTrafficChart: React.FC<LiveTrafficChartProps> = ({ data }) => {
  return (
    <Card title="Traffic Volume (EPS)" className="h-[400px]">
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#52525b" 
              tick={{fill: '#71717a', fontSize: 12}}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#52525b" 
              tick={{fill: '#71717a', fontSize: 12}}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#e4e4e7' }}
              itemStyle={{ color: '#10b981' }}
            />
            <Area 
              type="monotone" 
              dataKey="eps" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorEps)" 
              isAnimationActive={false} // Disable animation for smoother realtime updates
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};