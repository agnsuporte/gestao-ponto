import React from 'react';
import { Card } from "@/components/ui/card";
import TimeClockButton from './TimeClockButton';
import { motion } from "framer-motion";

export default function TimeSection({ 
  title, 
  icon: Icon, 
  entradaTime, 
  saidaTime, 
  onEntrada, 
  onSaida,
  entradaDisabled,
  saidaDisabled,
  bgColor = "bg-white"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${bgColor} border-0 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-slate-100">
              <Icon className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-800 text-lg">{title}</h3>
          </div>
          
          <div className="flex justify-around items-center">
            <TimeClockButton
              label="Entrada"
              time={entradaTime}
              onClock={onEntrada}
              type="entrada"
              disabled={entradaDisabled}
            />
            <div className="h-16 w-px bg-slate-200" />
            <TimeClockButton
              label="Saída"
              time={saidaTime}
              onClock={onSaida}
              type="saida"
              disabled={saidaDisabled}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}