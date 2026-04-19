import React from 'react';
import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { formatMinutesToTime } from '../lib/WorkHoursUtils';

function TimeSlot({ label, entrada, saida }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-slate-700 tabular-nums">
          {entrada || '--:--'}
        </span>
        <span className="text-slate-300">→</span>
        <span className="text-slate-700 tabular-nums">
          {saida || '--:--'}
        </span>
      </div>
    </div>
  );
}

export default function HistoryCard({ record, index }) {
  const dateFormatted = record.date 
    ? format(parseISO(record.date), "EEEE, dd 'de' MMMM", { locale: ptBR })
    : '';

  const hasOvertime = record.overtime_minutes > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-800 capitalize">{dateFormatted}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700 tabular-nums">
                  {formatMinutesToTime(record.total_minutes)}
                </span>
              </div>
              {hasOvertime && (
                <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  +{formatMinutesToTime(record.overtime_minutes)}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <TimeSlot 
              label="Jornada 1" 
              entrada={record.turno1_entrada} 
              saida={record.turno1_saida} 
            />
  
            <TimeSlot 
              label="Jornada 2" 
              entrada={record.turno2_entrada} 
              saida={record.turno2_saida} 
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}