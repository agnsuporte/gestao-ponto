// app/payslips/_components/payslip-header.tsx
"use client";

import * as React from "react";
import { Wallet, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SalarySettingsForm } from "./salary-settings";

interface PayslipHeaderProps {
  salarySettings: any;
  month: string;
  setMonth: (m: string) => void;
  year: string;
  setYear: (y: string) => void;
  onSettingsSaved: () => void;
}

export function PayslipHeader({
  salarySettings,
  month,
  setMonth,
  year,
  setYear,
  onSettingsSaved
}: PayslipHeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      {/* Topo com Botão de Configuração */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Recibos</h1>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 active:scale-95 transition-transform">
              <Settings className="w-4 h-4 mr-1.5 text-muted-foreground" />
              Configurar
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[92vw] max-w-md rounded-2xl p-6">
            <DialogHeader className="text-left">
              <DialogTitle>Configurações Salariais</DialogTitle>
              <DialogDescription>
                Atualize o seu ordenado base, subsídios ou retenções para os próximos rascunhos.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <SalarySettingsForm 
                initialData={salarySettings} 
                onSaveSuccess={() => {
                  setIsOpen(false);
                  onSettingsSaved();
                }} 
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Seletores Mobile-First */}
      <div className="grid grid-cols-2 gap-2">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="h-12 bg-background border-muted text-base">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {new Date(2000, i).toLocaleString("pt-PT", { month: "long" })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="h-12 bg-background border-muted text-base">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {["2025", "2026", "2027"].map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
