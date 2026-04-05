import React from 'react';
import { Card } from "@/components/ui/card";
import { Calendar, Clock, TrendingUp, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { formatMinutesToTime, OVERTIME_RATES } from '../lib/WorkHoursUtils';

function StatCard({ icon: Icon, label, value, subvalue, color = "slate" }) {
  const colorClasses = {
    slate: "bg-slate-100 text-slate-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {subvalue && <p className="text-xs text-slate-400 mt-1">{subvalue}</p>}
    </div>
  );
}

export default function MonthlyStats({ stats, monthLabel }) {

  const { totalMinutes = 0, totalOvertime = 0, daysWorked = 0 } = stats || {};
  
  // Calcular horas normais (total - extras)
  const normalMinutes = totalMinutes - totalOvertime;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Resumo - {monthLabel}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Clock}
          label="Total Trabalhado"
          value={formatMinutesToTime(totalMinutes)}
          subvalue={`${(totalMinutes / 60).toFixed(1)} horas`}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Horas Extras"
          value={formatMinutesToTime(totalOvertime)}
          subvalue={totalOvertime > 0 ? `${(totalOvertime / 60).toFixed(1)} horas` : "Nenhuma"}
          color="amber"
        />
        <StatCard
          icon={Calendar}
          label="Dias Trabalhados"
          value={daysWorked}
          subvalue="dias"
          color="emerald"
        />
        <StatCard
          icon={Briefcase}
          label="Horas Normais"
          value={formatMinutesToTime(normalMinutes)}
          subvalue={`${(normalMinutes / 60).toFixed(1)} horas`}
          color="slate"
        />
      </div>

      {/* Info sobre legislação */}
      <Card className="bg-blue-50 border-blue-100 p-4">
        <h4 className="font-medium text-blue-800 mb-2 text-sm">📋 Legislação Portuguesa</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Período normal: 8h/dia, 40h/semana</li>
          <li>• Primeiras 2h extras: +{OVERTIME_RATES.first_two_hours * 100}%</li>
          <li>• Horas seguintes: +{OVERTIME_RATES.additional_hours * 100}%</li>
          <li>• Dias de descanso: +{OVERTIME_RATES.rest_days * 100}%</li>
        </ul>
      </Card>
    </motion.div>
  );
}