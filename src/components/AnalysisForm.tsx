/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { analyzeSentiment } from "../lib/gemini";
import { SentimentAnalysisResult } from "../types";
import { cn } from "../lib/utils";

interface AnalysisFormProps {
  onResult: (result: SentimentAnalysisResult, text: string) => void;
  theme?: 'dark' | 'light';
}

export function AnalysisForm({ onResult, theme = 'dark' }: AnalysisFormProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<SentimentAnalysisResult | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    const result = await analyzeSentiment(text);
    setLastResult(result);
    onResult(result, text);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste social media comment or tweet here to analyze sentiment..."
          className={cn(
            "w-full h-32 p-6 rounded-2xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none shadow-sm font-medium",
            theme === 'dark' 
              ? "bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 group-hover:bg-white/[0.05]" 
              : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 group-hover:bg-slate-100"
          )}
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={!text.trim() || loading}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-lg font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 shadow-xl border-none cursor-pointer",
              theme === 'dark'
                ? "bg-white text-black hover:bg-emerald-400 shadow-emerald-500/10"
                : "bg-slate-900 text-white hover:bg-emerald-500 shadow-slate-900/10"
            )}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <>
                <Sparkles size={14} />
                Analyze Unit
              </>
            )}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-md",
              getSentimentColor(lastResult.sentiment, theme)
            )}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">
                  Classification: {lastResult.sentiment}
                </span>
                <span className="text-[10px] font-mono opacity-50 font-bold">
                  [{Math.round(lastResult.score * 100)}% RELIABILITY]
                </span>
              </div>
              <p className={cn(
                "text-sm italic leading-relaxed font-medium opacity-90",
                theme === 'dark' ? "text-white" : "text-slate-800"
              )}>
                "{lastResult.reasoning}"
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {lastResult.keyKeywords.map((kw, i) => (
                <span key={i} className={cn(
                  "px-3 py-1 rounded text-[9px] font-mono font-black uppercase tracking-widest border",
                  theme === 'dark' 
                    ? "bg-black/20 border-white/5 text-emerald-400" 
                    : "bg-slate-200 border-slate-300 text-slate-700"
                )}>
                  #{kw}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const getSentimentColor = (sentiment: string, theme: 'dark' | 'light') => {
  if (theme === 'dark') {
    switch (sentiment) {
      case 'positive': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'negative': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  } else {
    switch (sentiment) {
      case 'positive': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'negative': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  }
};
