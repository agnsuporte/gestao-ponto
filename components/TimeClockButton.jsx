import React from 'react';
import { Button } from "@/components/ui/button";
import { Clock, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function TimeClockButton({ label, time, onClock, type, disabled }) {
  const isEntry = type === 'entrada';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-2"
    >
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </span>
      
      {time ? (
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700 text-lg tabular-nums">
            {time}
          </span>
        </div>
      ) : (
        <Button
          onClick={onClock}
          disabled={disabled}
          className={`
            px-6 py-6 rounded-xl text-white font-medium shadow-lg transition-all duration-300
            ${isEntry 
              ? 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-emerald-200' 
              : 'bg-rose-500 hover:bg-rose-600 hover:shadow-rose-200'}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isEntry ? (
            <LogIn className="w-5 h-5 mr-2" />
          ) : (
            <LogOut className="w-5 h-5 mr-2" />
          )}
          {isEntry ? 'Entrada' : 'Saída'}
        </Button>
      )}
    </motion.div>
  );
}