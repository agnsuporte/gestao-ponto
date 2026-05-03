import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { CreditCard, HeartHandshake, ShieldCheck, Check, Sparkles } from 'lucide-react';

import { BillingPortalButton } from '@/components/billing/billing-portal-button';
import { DonationCheckoutForm } from '@/components/billing/donation-checkout-form';
import { StripeCheckoutButton } from '@/components/billing/stripe-checkout-button';
import { Card } from '@/components/ui/card';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

const plans = [
  {
    key: 'solo' as const,
    name: 'Solo',
    price: '€3/mês',
    description: 'Para profissionais independentes que querem uma solução simples para registar a jornada.',
  },
  {
    key: 'equipa' as const,
    name: 'Equipa',
    price: '€9/mês',
    description: 'Até 5 utilizadores para pequenas equipas que querem mais organização sem complicação.',
  },
  {
    key: 'piloto' as const,
    name: 'Piloto Assistido',
    price: '€21/mês',
    description: 'Para quem quer acompanhamento mais próximo no arranque e na adoção inicial.',
  },
];

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      billingStatus: true,
      stripePriceId: true,
      stripeCustomerId: true,
      email: true,
    },
  });

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* NOVO: Aviso de Período de Teste Gratuito */}
       

        <div className="space-y-3 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Faturação</p>
          <h1 className="text-4xl font-semibold text-slate-900">Gerir plano e apoio ao projeto</h1>
          <p className="mx-auto max-w-2xl text-slate-600">
            Escolha o plano certo para a sua utilização e, se quiser, deixe também uma doação para apoiar a evolução do Ponto Inteligente.
          </p>
        </div>

        <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-800">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">Estado atual da conta</span>
              </div>
              <p className="text-sm text-slate-600">Conta: {user?.email}</p>
              <p className="text-sm text-slate-600">
                Estado da subscrição:{' '}
                <span className="font-medium text-slate-900">{user?.billingStatus ?? 'sem plano ativo'}</span>
              </p>
            </div>



            {user?.stripeCustomerId ? (
              <BillingPortalButton className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                <CreditCard className="mr-2 h-4 w-4" />
                Gerir faturação
              </BillingPortalButton>
            ) : (
              <Link href="#plans" className="text-sm font-medium text-slate-700 hover:text-slate-950">
                Escolher plano
              </Link>
            )}
          </div>
        </Card>

 <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl overflow-hidden relative">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <Sparkles className="h-5 w-5" />
              <span>Acesso Antecipado Ativo</span>
            </div>
            <h2 className="text-2xl font-bold">Estamos em fase de lançamento!</h2>
            <p className="text-slate-300 max-w-md text-sm">
              Como agradecimento por ser um dos primeiros utilizadores, o acesso ao Ponto Inteligente é 
              <strong> totalmente gratuito</strong> durante este período inicial.
            </p>
          </div>
          
          <div className="relative z-10">
            {user?.billingStatus === 'free_trial' || user?.billingStatus === 'active' ? (
              <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-6 py-3 rounded-full border border-emerald-500/30">
                <Check className="h-5 w-5" />
                <span className="font-semibold">Acesso já libertado</span>
              </div>
            ) : (
              /* Se não tiver plano, mostramos um link/botão para ativar o trial */
              <Link 
                href="/api/billing/activate-free" 
                className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-all shadow-lg inline-block"
              >
                Ativar Acesso Gratuito
              </Link>
            )}
          </div>
        </div>        

        <section id="plans" className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.key} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{plan.name}</p>
              <div className="mt-4 text-4xl font-semibold text-slate-900">{plan.price}</div>
              <p className="mt-4 min-h-20 text-sm leading-7 text-slate-600">{plan.description}</p>
              <StripeCheckoutButton
                kind="subscription"
                plan={plan.key}
                requireAuth
                className="mt-6 w-full rounded-full bg-slate-900 text-white hover:bg-slate-800"
              >
                Subscrever {plan.name}
              </StripeCheckoutButton>
            </Card>
          ))}
        </section>

        <Card className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-900">
                <HeartHandshake className="h-5 w-5" />
                <span className="font-medium">Apoiar o projeto</span>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-emerald-900/80">
                A doação é opcional e faz sentido como apoio ao projeto, não como substituto da subscrição.
                Pode ser uma boa ideia se quiser criar uma forma simples de agradecer e financiar melhorias futuras.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[5, 10, 20].map((amount) => (
                <StripeCheckoutButton
                  key={amount}
                  kind="donation"
                  amount={amount}
                  className="rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  Doar €{amount}
                </StripeCheckoutButton>
              ))}
              <DonationCheckoutForm />
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
