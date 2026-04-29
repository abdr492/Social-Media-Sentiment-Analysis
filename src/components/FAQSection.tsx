/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { HelpCircle, ChevronDown, Award, Rocket, Briefcase } from "lucide-react";
import { useState } from "react";
import { INTERVIEW_FAQ, PROJECT_FACTS } from "../constants";
import { cn } from "../lib/utils";

interface FAQSectionProps {
  theme?: 'dark' | 'light';
}

export function FAQSection({ theme = 'dark' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-24">
      <div className="lg:col-span-2 space-y-8">
        <div className={cn(
          "flex items-center gap-4 border-b pb-8",
          theme === 'dark' ? "border-white/5" : "border-slate-200"
        )}>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <HelpCircle size={28} />
          </div>
          <div>
            <h2 className={cn(
              "text-3xl font-black font-display uppercase tracking-tight",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>Portfolio Guide</h2>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Deep analysis core concepts</p>
          </div>
        </div>

        <div className="space-y-4">
          {INTERVIEW_FAQ.map((item, index) => (
            <motion.div
              key={index}
              initial={false}
              className={cn(
                "border rounded-2xl overflow-hidden transition-all duration-300",
                openIndex === index 
                  ? (theme === 'dark' ? "bg-white/[0.04] border-emerald-500/30" : "bg-emerald-50/50 border-emerald-500/30") 
                  : (theme === 'dark' ? "bg-white/[0.02] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-emerald-200")
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={cn(
                  "font-bold text-sm uppercase tracking-tight", 
                  openIndex === index ? "text-emerald-500" : (theme === 'dark' ? "text-white" : "text-slate-700")
                )}>
                  {index + 1}. {item.question}
                </span>
                <ChevronDown size={18} className={cn("text-slate-500 transition-transform duration-300", openIndex === index && "rotate-180 text-emerald-500")} />
              </button>
              <div 
                className={cn(
                  "px-6 pb-6 transition-all duration-300 overflow-hidden",
                  openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className={cn("h-px mb-6", theme === 'dark' ? "bg-white/5" : "bg-slate-100")} />
                <p className={cn(
                  "text-sm leading-relaxed font-medium italic",
                  theme === 'dark' ? "text-slate-400" : "text-slate-600"
                )}>
                  {item.answer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-emerald-500 rounded-3xl p-8 text-black overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <h3 className="text-lg font-black mb-8 flex items-center gap-2 uppercase tracking-tighter">
            <Award className="text-black" size={20} />
            Market Insights
          </h3>

          <div className="space-y-8">
            {PROJECT_FACTS.map((fact, i) => (
              <div key={i} className="relative z-10 border-l-4 border-black/20 pl-5 py-1">
                <p className="text-[10px] font-mono font-black text-black/60 uppercase tracking-[0.2em] mb-1">{fact.label}</p>
                <p className="text-3xl font-black tracking-tighter">{fact.value}</p>
                <p className="text-[10px] text-black/70 font-bold uppercase tracking-widest leading-none">{fact.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-5 bg-black/5 rounded-2xl border border-black/10 backdrop-blur-sm">
            <h4 className="text-xs font-black mb-2 flex items-center gap-2 uppercase tracking-widest">
              <Rocket size={16} className="text-black" />
              Deployment
            </h4>
            <p className="text-xs text-black/70 font-bold leading-relaxed px-1">
              Add this project to your GitHub by uploading the code and screenshots. Use high-contrast thumbnails.
            </p>
          </div>
        </div>

        <div className={cn(
          "p-8 rounded-3xl border",
          theme === 'dark' ? "bg-white/[0.02] border-white/5" : "bg-white border-slate-200 shadow-sm"
        )}>
          <h3 className="text-xs font-mono font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <Briefcase size={16} className="text-emerald-400" />
            Applications
          </h3>
          <ul className="space-y-4">
            {[
              "E-commerce Feed Analysis",
              "Political Sentiment Tracking",
              "Crisis Reputation Engine",
              "Customer Intent Capture"
            ].map((useCase, i) => (
              <li key={i} className={cn(
                "flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-widest p-4 rounded-xl border transition-colors",
                theme === 'dark' 
                  ? "text-slate-400 bg-white/[0.01] border-white/5 hover:bg-white/[0.03]" 
                  : "text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100"
              )}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
                {useCase}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
