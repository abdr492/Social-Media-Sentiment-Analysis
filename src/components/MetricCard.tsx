/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  color: "blue" | "green" | "red" | "orange";
}

const colorMap = {
  blue: "text-blue-600 bg-blue-50 border-blue-100",
  green: "text-green-600 bg-green-50 border-green-100",
  red: "text-red-600 bg-red-50 border-red-100",
  orange: "text-orange-600 bg-orange-50 border-orange-100",
};

export function MetricCard({ title, value, subValue, icon: Icon, color }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-2xl border transition-all hover:shadow-lg",
        "bg-white border-slate-200"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg", colorMap[color])}>
          <Icon size={24} />
        </div>
        {subValue && <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{subValue}</span>}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </motion.div>
  );
}
