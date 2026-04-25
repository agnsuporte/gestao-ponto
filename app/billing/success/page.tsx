import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

import { Card } from '@/components/ui/card';

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind } = await searchParams;
  const isDonation = kind === 'donation';

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 via-white to-slate-100 p-4">
      <Card className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-slate-900">
          {isDonation ? 'Obrigado pelo apoio' : 'Pagamento concluído'}
        </h1>
        <p className="mt-4 text-slate-600">
          {isDonation
            ? 'A sua doação foi recebida com sucesso. Obrigado por ajudar a manter o projeto vivo.'
            : 'A sua sessão de checkout foi concluída. O estado da subscrição será atualizado automaticamente.'}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/billing"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Voltar à faturação
          </Link>
          <Link
            href="/time-record"
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Ir para a aplicação
          </Link>
        </div>
      </Card>
    </main>
  );
}
