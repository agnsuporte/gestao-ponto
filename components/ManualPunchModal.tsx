'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { manualPunchSchema, ManualPunchInput } from '@/lib/time-record'; // ajuste o import se necessário

interface ManualPunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ManualPunchInput) => Promise<void>;
  isPending: boolean;
  defaultValues?: Partial<ManualPunchInput>;
}

export default function ManualPunchModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  defaultValues,
}: ManualPunchModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualPunchInput>({
    resolver: zodResolver(manualPunchSchema),
    defaultValues: {
      turno1_entrada: '',
      turno1_saida: '',
      turno2_entrada: '',
      turno2_saida: '',
    },
  });

  // Atualiza os campos se o registro do dia já possuir dados salvos
  useEffect(() => {
    if (isOpen && defaultValues) {
      reset({
        turno1_entrada: defaultValues.turno1_entrada || '',
        turno1_saida: defaultValues.turno1_saida || '',
        turno2_entrada: defaultValues.turno2_entrada || '',
        turno2_saida: defaultValues.turno2_saida || '',
      });
    }
  }, [isOpen, defaultValues, reset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fundo Desfocado e Escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Card do Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 z-10"
          >
            {/* Cabeçalho */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-700" />
                <h3 className="font-semibold text-slate-800">
                  Lançamento em Bloco
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Secção: Jornada 1 */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Jornada 1
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Entrada
                    </label>
                    <input
                      type="time"
                      {...register('turno1_entrada')}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-800 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Saída
                    </label>
                    <input
                      type="time"
                      {...register('turno1_saida')}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-800 transition-colors"
                    />
                  </div>
                </div>
                {errors.turno1_saida && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.turno1_saida.message}
                  </p>
                )}
              </div>

              {/* Secção: Jornada 2 */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Jornada 2
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Entrada
                    </label>
                    <input
                      type="time"
                      {...register('turno2_entrada')}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-800 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Saída
                    </label>
                    <input
                      type="time"
                      {...register('turno2_saida')}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-slate-800 transition-colors"
                    />
                  </div>
                </div>
                {errors.turno2_saida && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.turno2_saida.message}
                  </p>
                )}
              </div>

              {/* Ações */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 min-w-100px"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Salvar Tudo'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
