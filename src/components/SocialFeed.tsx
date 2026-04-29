/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Twitter, Youtube, Facebook, MessageSquare, Clock, User, CheckCircle2, ChevronRight } from "lucide-react";
import { SocialMediaPost } from "../types";
import { cn } from "../lib/utils";

interface SocialFeedProps {
  posts: SocialMediaPost[];
  theme?: 'dark' | 'light';
}

const platformIcons = {
  Twitter: <Twitter size={14} className="text-[#1DA1F2]" />,
  YouTube: <Youtube size={14} className="text-[#FF0000]" />,
  Facebook: <Facebook size={14} className="text-[#1877F2]" />,
  Reddit: <MessageSquare size={14} className="text-[#FF4500]" />,
};

const getSentimentColors = (sentiment: 'positive' | 'negative' | 'neutral', theme: 'dark' | 'light') => {
  if (theme === 'dark') {
    return {
      positive: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20",
      negative: "text-red-400 bg-red-500/5 border-red-500/20",
      neutral: "text-blue-400 bg-blue-500/5 border-blue-500/20",
    }[sentiment];
  } else {
    return {
      positive: "text-emerald-700 bg-emerald-50 border-emerald-200",
      negative: "text-red-700 bg-red-50 border-red-200",
      neutral: "text-blue-700 bg-blue-50 border-blue-200",
    }[sentiment];
  }
};

export function SocialFeed({ posts, theme = 'dark' }: SocialFeedProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group relative border rounded-xl p-5 transition-all cursor-default",
                theme === 'dark' 
                  ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10" 
                  : "bg-white border-slate-200 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded border flex items-center justify-center text-slate-500 group-hover:text-emerald-400 transition-colors",
                    theme === 'dark' ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                  )}>
                    <User size={18} />
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-black tracking-tight",
                      theme === 'dark' ? "text-white" : "text-slate-900"
                    )}>@{post.author}</p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                      {platformIcons[post.platform]}
                      {post.platform} <span className="opacity-30 self-center">•</span> {post.timestamp}
                    </div>
                  </div>
                </div>
                {post.sentiment && (
                  <div className={cn(
                    "px-3 py-1 rounded text-[9px] font-mono font-black uppercase tracking-[0.2em] border flex items-center gap-2",
                    getSentimentColors(post.sentiment, theme)
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", post.sentiment === 'positive' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : post.sentiment === 'negative' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-400')} />
                    {post.sentiment}
                  </div>
                )}
              </div>
              
              <p className={cn(
                "text-sm leading-relaxed font-medium mb-4 pl-1",
                theme === 'dark' ? "text-slate-300" : "text-slate-600"
              )}>
                {post.content}
              </p>

              {post.confidence !== undefined && (
                <div className={cn(
                  "flex items-center justify-between pt-4 border-t mt-2",
                  theme === 'dark' ? "border-white/5" : "border-slate-100"
                )}>
                  <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    Neural Confidence: {Math.round(post.confidence * 100)}%
                  </div>
                  <ChevronRight size={14} className="text-slate-700 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {posts.length === 0 && (
          <div className={cn(
            "text-center py-20 rounded-2xl border border-dashed",
            theme === 'dark' ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-200"
          )}>
            <p className="text-slate-600 text-[10px] font-mono uppercase tracking-[0.3em] font-bold italic">Waiting for incoming data stream...</p>
          </div>
        )}
      </div>
    </div>
  );
}
