/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "motion/react";
import { SocialMediaPost } from '../types';
import { useMemo } from 'react';
import { cn } from '../lib/utils';

interface TrendChartProps {
  posts: SocialMediaPost[];
  theme?: 'dark' | 'light';
}

export function TrendChart({ posts, theme = 'dark' }: TrendChartProps) {
  const processedData = useMemo(() => {
    if (posts.length === 0) return [];

    const reversedPosts = [...posts].reverse();
    const data = [];
    const numPoints = 12;
    const itemsPerPoint = Math.max(1, Math.ceil(reversedPosts.length / numPoints));

    for (let i = 0; i < reversedPosts.length; i += itemsPerPoint) {
      const chunk = reversedPosts.slice(i, i + itemsPerPoint);
      const pos = chunk.filter(p => p.sentiment === 'positive').length;
      const neg = chunk.filter(p => p.sentiment === 'negative').length;
      const neu = chunk.filter(p => p.sentiment === 'neutral').length;

      data.push({
        name: chunk[chunk.length - 1].timestamp || `T-${data.length}`,
        positive: pos,
        neutral: neu,
        negative: neg,
      });
    }
    return data;
  }, [posts]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-8 rounded-3xl border transition-all",
        theme === 'dark' ? "bg-white/[0.02] border-white/5" : "bg-white border-slate-200 shadow-sm"
      )}
    >
      <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-8 font-bold flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Sentiment Velocity Over Stream
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#ffffff05" : "#00000005"} vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 9, fontWeight: 700 }} 
              hide={posts.length < 5}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#0A0A0B' : '#ffffff', 
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)', 
                borderRadius: '12px',
                boxShadow: theme === 'light' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
              }}
              itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
              labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}
            />
            <Line 
              type="monotone" 
              dataKey="positive" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }} 
              activeDot={{ r: 6, strokeWidth: 0 }} 
            />
            <Line 
              type="monotone" 
              dataKey="negative" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={{ fill: '#ef4444', r: 4, strokeWidth: 0 }} 
              activeDot={{ r: 6, strokeWidth: 0 }} 
            />
            <Line 
              type="monotone" 
              dataKey="neutral" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
