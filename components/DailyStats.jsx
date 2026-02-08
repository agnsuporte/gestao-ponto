// import React from 'react';
import { Card } from "@/components/ui/card";
import { Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { formatMinutesToTime, DAILY_MINUTES } from '../lib/WorkHoursUtils';

export default function DailyStats({ totalMinutes = 0, overtimeMinutes = 0 }) {
  const percentage = Math.min(100, (totalMinutes / DAILY_MINUTES) * 100);
  const hasOvertime = overtimeMinutes > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0 shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-300">Horas Trabalhadas Hoje</h3>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>

          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold tabular-nums">
              {formatMinutesToTime(totalMinutes)}
            </span>
            <span className="text-slate-400 mb-1">/ 08:00</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                hasOvertime 
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-500' 
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
              }`}
            />
          </div>

          {/* Overtime info */}
          {hasOvertime && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-2 rounded-lg"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                Horas Extras: {formatMinutesToTime(overtimeMinutes)}
              </span>
            </motion.div>
          )}

          {!hasOvertime && totalMinutes > 0 && totalMinutes < DAILY_MINUTES && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Faltam {formatMinutesToTime(DAILY_MINUTES - totalMinutes)} para completar</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}