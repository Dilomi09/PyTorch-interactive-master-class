import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TrainingCurveProps {
  data: number[];
}

export const TrainingCurve: React.FC<TrainingCurveProps> = ({ data }) => {
  const chartData = data.map((val, idx) => ({ epoch: idx, loss: val }));

  if (data.length === 0) return <div className="flex h-full items-center justify-center text-gray-400">No training data yet</div>;

  return (
    <div className="w-full h-full min-h-[200px] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
            <defs>
                <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9500" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF9500" stopOpacity={0}/>
                </linearGradient>
            </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis dataKey="epoch" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} width={30} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none' }}
            itemStyle={{ color: '#fff' }}
          />
          <Line 
            type="monotone" 
            dataKey="loss" 
            stroke="#FF9500" 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6, fill: '#fff' }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};