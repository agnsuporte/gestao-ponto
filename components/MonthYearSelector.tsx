// "use client";

// import React from 'react';

// interface MonthYearSelectorProps {
//   month: number;
//   year: number;
//   onChange: (month: number, year: number) => void;
// }

// const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({ month, year, onChange }) => {
  
//   // Funções simples que apenas repassam a mudança para o pai
//   const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     onChange(parseInt(event.target.value), year);
//   };

//   const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     onChange(month, parseInt(event.target.value));
//   };

//   const currentYear = new Date().getFullYear();

//   return (
//     <div>
//       <label htmlFor="month">Mês: </label>
//       <select id="month" value={month} onChange={handleMonthChange}>
//         <option value="1">Janeiro</option>
//         <option value="2">Fevereiro</option>
//         <option value="3">Março</option>
//         <option value="4">Abril</option>
//         <option value="5">Maio</option>
//         <option value="6">Junho</option>
//         <option value="7">Julho</option>
//         <option value="8">Agosto</option>
//         <option value="9">Setembro</option>
//         <option value="10">Outubro</option>
//         <option value="11">Novembro</option>
//         <option value="12">Dezembro</option>
//       </select>

//       <label htmlFor="year" style={{ marginLeft: '10px' }}>Ano: </label>
//       <select id="year" value={year} onChange={handleYearChange}>
//         <option value={currentYear}>{currentYear}</option>
//         <option value={currentYear - 1}>{currentYear - 1}</option>
//         <option value={currentYear + 1}>{currentYear + 1}</option>
//       </select>
//     </div>
//   );
// };

// export default MonthYearSelector;

"use client";

import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons'; // Opcional: npm install @radix-ui/react-icons

interface MonthYearSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({ month, year, onChange }) => {
  const currentYear = new Date().getFullYear();
  const months = [
    { v: "1", l: "Janeiro" }, { v: "2", l: "Fevereiro" }, { v: "3", l: "Março" },
    { v: "4", l: "Abril" }, { v: "5", l: "Maio" }, { v: "6", l: "Junho" },
    { v: "7", l: "Julho" }, { v: "8", l: "Agosto" }, { v: "9", l: "Setembro" },
    { v: "10", l: "Outubro" }, { v: "11", l: "Novembro" }, { v: "12", l: "Dezembro" },
  ];

  const years = [
    { v: String(currentYear - 1), l: String(currentYear - 1) },
    { v: String(currentYear), l: String(currentYear) },
    { v: String(currentYear + 1), l: String(currentYear + 1) },
  ];

  return (
    <div className="flex items-center gap-4 p-4 mb-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mês</label>
        <CustomSelect 
          value={String(month)} 
          options={months} 
          onValueChange={(v) => onChange(parseInt(v), year)} 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ano</label>
        <CustomSelect 
          value={String(year)} 
          options={years} 
          onValueChange={(v) => onChange(month, parseInt(v))} 
        />
      </div>
    </div>
  );
};

// Sub-componente para evitar repetição de estilos Radix
const CustomSelect = ({ value, options, onValueChange }: { value: string, options: {v: string, l: string}[], onValueChange: (v: string) => void }) => (
  <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger className="inline-flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-140px">
      <Select.Value />
      <Select.Icon>
        <ChevronDownIcon className="h-4 w-4 text-slate-400" />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content className="overflow-hidden bg-white dark:bg-slate-800 rounded-md shadow-xl border border-slate-200 dark:border-slate-700 z-50">
        <Select.Viewport className="p-1">
          {options.map((opt) => (
            <Select.Item
              key={opt.v}
              value={opt.v}
              className="relative flex items-center px-8 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-sm hover:bg-blue-600 hover:text-white cursor-pointer outline-none select-none data-disabled:text-slate-400 data-disabled:pointer-events-none"
            >
              <Select.ItemText>{opt.l}</Select.ItemText>
              <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                <CheckIcon className="h-4 w-4" />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export default MonthYearSelector;
