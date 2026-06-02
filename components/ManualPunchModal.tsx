'use client';

import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, Loader2 } from 'lucide-react';
import { manualPunchSchema, ManualPunchInput } from '@/lib/time-record';

// Importações dos componentes nativos do Shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  
  // 1. Inicialização do Form com Shadcn/react-hook-form
  const form = useForm<ManualPunchInput>({
    resolver: zodResolver(manualPunchSchema),
    defaultValues: {
      turno1_entrada: '',
      turno1_saida: '',
      turno2_entrada: '',
      turno2_saida: '',
    },
  });

  // Criamos uma referência para rastrear se o formulário já foi inicializado nesta abertura
  const isInitialized = useRef(false);

  // 2. Sincronização de valores iniciais/salvos
  useEffect(() => {
    // Se o modal fechar, resetamos o controlo e limpamos o formulário
    if (!isOpen) {
      isInitialized.current = false;
      return;
    }    

    // Só executa o reset se o modal estiver aberto E ainda não tiver sido inicializado
    if (isOpen && defaultValues && !isInitialized.current) {
      form.reset({
        turno1_entrada: defaultValues.turno1_entrada || '',
        turno1_saida: defaultValues.turno1_saida || '',
        turno2_entrada: defaultValues.turno2_entrada || '',
        turno2_saida: defaultValues.turno2_saida || '',
      });
      
      // Bloqueia permanentemente novos resets até o modal fechar
      isInitialized.current = true;      
    }
  }, [isOpen, defaultValues, form]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0 rounded-2xl border border-slate-100 bg-white dark:bg-slate-950">
        
        {/* Cabeçalho do Modal */}
        <DialogHeader className="px-6 py-4 bg-slate-50 border-b border-slate-100 dark:bg-slate-900 dark:border-slate-800 flex flex-row items-center gap-2 space-y-0">
          <Clock className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <DialogTitle className="font-semibold text-slate-800 dark:text-slate-200">
            Lançamento Manual
          </DialogTitle>
        </DialogHeader>

        {/* Formulário Controlado do Shadcn */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-5">
            
            {/* Secção: Jornada 1 */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Jornada 1
              </h4>
              {/* CORREÇÃO: grid-cols-1 por padrão (mobile) e sm:grid-cols-2 para ecrãs maiores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="turno1_entrada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600 dark:text-slate-400">Entrada</FormLabel>
                      <FormControl>
                        <Input type="time" className="bg-white dark:bg-slate-950 w-full" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="turno1_saida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600 dark:text-slate-400">Saída</FormLabel>
                      <FormControl>
                        <Input type="time" className="bg-white dark:bg-slate-950 w-full" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Secção: Jornada 2 */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Jornada 2
              </h4>
              {/* CORREÇÃO: grid-cols-1 por padrão (mobile) e sm:grid-cols-2 para ecrãs maiores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="turno2_entrada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600 dark:text-slate-400">Entrada</FormLabel>
                      <FormControl>
                        <Input type="time" className="bg-white dark:bg-slate-950 w-full" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="turno2_saida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-600 dark:text-slate-400">Saída</FormLabel>
                      <FormControl>
                        <Input type="time" className="bg-white dark:bg-slate-950 w-full" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Ações / Rodapé */}
            {/* OTIMIZAÇÃO UX MOBILE: botões empilhados em ecrãs pequenos e em linha com sm:flex-row */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isPending}
                className="rounded-xl w-full sm:w-auto"
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                disabled={isPending}
                className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl min-w-[100px] gap-2 w-full sm:w-auto"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Salvar Tudo'
                )}
              </Button>
            </div>

          </form>
        </Form>

      </DialogContent>
    </Dialog>
  );
}
