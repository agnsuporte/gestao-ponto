"use client"; //  Define este ficheiro como um Client Component

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Briefcase, Coffee, Sun, History, Loader2, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import TimeSection from '@/components/TimeSection';
import HistoryCard from '@/components/HistoryCard';
import DailyStats from '@/components/DailyStats';
import MonthlyStats from '@/components/MonthlyStats';
import MonthYearSelector from '@/components/MonthYearSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateDailyWorkMinutes, calculateMonthlyStats } from '@/lib/WorkHoursUtils';
// import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

import { TimeRecord, TimeRecordField } from '@/types/timeRecord';

import { api } from '@/lib/api';

interface ClockMutationVariables {
  field: TimeRecordField;
  time: string;
}

export default function Home(): React.JSX.Element {
  const queryClient = useQueryClient();
  const today: string = format(new Date(), 'yyyy-MM-dd');
  
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  //const currentTime: string = format(new Date(), "HH:mm");
  const [currentTime, setCurrentTime] = useState<string>(() => format(new Date(), "HH:mm"));

  const { data: todayRecord, isLoading: loadingToday } = useQuery<TimeRecord | null>({
    queryKey: ['todayRecord', today],
    queryFn: async (): Promise<TimeRecord | null> => {
      const records = await api.timeRecords.filter({ date: today });
      return records[0] || null;
    },
  });

  const { data: history = [], isLoading: loadingHistory } = useQuery<TimeRecord[]>({
    queryKey: ['timeHistory', month, year],
    queryFn: async (): Promise<TimeRecord[]> => {
      return api.timeRecords.list('-date', 100, month, year);
    },
  });

  const clockMutation = useMutation<TimeRecord, Error, ClockMutationVariables>({
    mutationFn: async ({ field, time }: ClockMutationVariables): Promise<TimeRecord> => {
      let updatedRecord: Partial<TimeRecord>;
      
      if (todayRecord?.id) {
        updatedRecord = { ...todayRecord, [field]: time };
        await api.timeRecords.update(todayRecord.id, { [field]: time });
      } else {
        updatedRecord = { date: today, [field]: time };
        await api.timeRecords.create(updatedRecord);
      }
      
      const { total, overtime } = calculateDailyWorkMinutes(updatedRecord as TimeRecord);
      if (todayRecord?.id) {
        await api.timeRecords.update(todayRecord.id, { 
          total_minutes: total, 
          overtime_minutes: overtime 
        });
      }
      
      return updatedRecord as TimeRecord;
    },
    onSuccess: (): void => {
      queryClient.invalidateQueries({ queryKey: ['todayRecord'] });
      queryClient.invalidateQueries({ queryKey: ['timeHistory'] });
    },
  });

  const handleClock = (field: TimeRecordField): void => {
    const now: string = format(new Date(), 'HH:mm');
    clockMutation.mutate({ field, time: now });
  };

  const currentDate: string = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  // const monthLabel: string = format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });
  // Criamos uma data fictícia (mês no JS começa em 0, por isso -1)
  const specificMonth = new Date(2024, month - 1, 1);

  const specificMonthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(specificMonth);

  const dailyStats = calculateDailyWorkMinutes(todayRecord);

  // const currentMonthRecords: TimeRecord[] = history.filter((record: TimeRecord): boolean => {
  //   if (!record.date) return false;
  //   const recordDate: Date = parseISO(record.date);
  //   return isWithinInterval(recordDate, {
  //     start: startOfMonth(new Date()),
  //     end: endOfMonth(new Date())
  //   });
  // });

  const monthlyStats = calculateMonthlyStats(history);

  useEffect(() => {
    // Cria um intervalo que roda a cada segundo (1000ms)
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm"));
    }, 1000);

    // Limpa o intervalo se o componente for destruído (evita memory leaks)
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            Controle de Ponto
          </h1>
          <p className="text-slate-500 capitalize">{currentDate}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-slate-800 text-white px-5 py-2 rounded-full">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="font-mono text-xl tabular-nums">{currentTime}</span>
          </div>
        </motion.div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full mb-6 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger 
              value="today" 
              className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Sun className="w-4 h-4 mr-2" />
              Hoje
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <History className="w-4 h-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger 
              value="stats"
              className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Resumo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4 mt-0">
            {loadingToday ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : (
              <>
                <DailyStats 
                  totalMinutes={dailyStats.total} 
                  overtimeMinutes={dailyStats.overtime} 
                />

                <TimeSection
                  title="Turno 1"
                  icon={Briefcase}
                  entradaTime={todayRecord?.turno1_entrada}
                  saidaTime={todayRecord?.turno1_saida}
                  onEntrada={() => handleClock('turno1_entrada')}
                  onSaida={() => handleClock('turno1_saida')}
                  entradaDisabled={clockMutation.isPending}
                  saidaDisabled={!todayRecord?.turno1_entrada || clockMutation.isPending}
                />

                <TimeSection
                  title="Almoço"
                  icon={Coffee}
                  entradaTime={todayRecord?.almoco_entrada}
                  saidaTime={todayRecord?.almoco_saida}
                  onEntrada={() => handleClock('almoco_entrada')}
                  onSaida={() => handleClock('almoco_saida')}
                  entradaDisabled={!todayRecord?.turno1_saida || clockMutation.isPending}
                  saidaDisabled={!todayRecord?.almoco_entrada || clockMutation.isPending}
                />

                <TimeSection
                  title="Turno 2"
                  icon={Sun}
                  entradaTime={todayRecord?.turno2_entrada}
                  saidaTime={todayRecord?.turno2_saida}
                  onEntrada={() => handleClock('turno2_entrada')}
                  onSaida={() => handleClock('turno2_saida')}
                  entradaDisabled={!todayRecord?.almoco_saida || clockMutation.isPending}
                  saidaDisabled={!todayRecord?.turno2_entrada || clockMutation.isPending}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <MonthYearSelector 
              month={month} 
              year={year} 
              onChange={(m, y) => { setMonth(m); setYear(y); }}  
            />

            {loadingHistory ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Nenhum registro encontrado</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((record, index) => (
                  <HistoryCard key={record.id} record={record} index={index} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-0">
            {loadingHistory ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : (
              <MonthlyStats stats={monthlyStats} monthLabel={specificMonthLabel} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}




