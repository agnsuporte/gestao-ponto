import Link from 'next/link';
import { CircleAlert } from 'lucide-react';

import { Card } from '@/components/ui/card';

export default async function BillingCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind } = await searchParams;
  const isDonation = kind === 'donation';

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 via-white to-slate-100 p-4">
      <Card className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <CircleAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-slate-900">
          {isDonation ? 'Doação cancelada' : 'Checkout cancelado'}
        </h1>
        <p className="mt-4 text-slate-600">
          {isDonation
            ? 'A doação não foi concluída. Pode voltar a tentar quando quiser.'
            : 'A subscrição não foi concluída. Pode rever os planos e tentar novamente.'}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/billing"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Voltar à faturação
          </Link>
          <Link
            href="/"
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Voltar ao site
          </Link>
        </div>
      </Card>
    </main>
  );
}
