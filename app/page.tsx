"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarRange,
  CheckCircle2,
  Clock3,
  Euro,
  HeartHandshake,
  LineChart,
  ShieldCheck,
  Users,
} from "lucide-react";

import { StripeCheckoutButton } from "@/components/billing/stripe-checkout-button";
import { DonationCheckoutForm } from "@/components/billing/donation-checkout-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const highlights = [
  "Pensado para pequenas equipas e negócios em Portugal",
  "Registo diário simples, com histórico e resumo mensal",
  "Acesso online sem folhas Excel confusas",
];

const steps = [
  {
    title: "Criar conta",
    description: "Comece em minutos e deixe a equipa pronta para registar a jornada.",
    icon: Users,
  },
  {
    title: "Registar o dia",
    description: "Marque entradas e saídas com rapidez, no computador ou no telemóvel.",
    icon: Clock3,
  },
  {
    title: "Consultar o resumo",
    description: "Veja histórico, totais e horas extra sem contas manuais.",
    icon: LineChart,
  },
];

const pricingPlans = [
  {
    key: "solo" as const,
    name: "Solo",
    price: "€3",
    cadence: "/mês",
    description: "Para profissionais independentes que querem registar e consultar o tempo com clareza.",
    cta: "Subscrever",
    accent: "slate",
    features: [
      "Registo diário de entradas e saídas",
      "Histórico mensal simples",
      "Resumo de horas trabalhadas",
      "Acesso online",
    ],
  },
  {
    key: "equipa" as const,
    name: "Equipa",
    price: "€9",
    cadence: "/mês",
    description: "Até 5 utilizadores, ideal para pequenas equipas que precisam de simplicidade.",
    cta: "Subscrever",
    accent: "blue",
    featured: true,
    features: [
      "Tudo no plano Solo",
      "Até 5 utilizadores",
      "Acompanhamento da equipa",
      "Leitura rápida do histórico",
    ],
  },
  {
    key: "piloto" as const,
    name: "Piloto Assistido",
    price: "€21",
    cadence: "/mês",
    description: "Para os primeiros clientes que querem apoio próximo na configuração e adoção.",
    cta: "Subscrever",
    accent: "emerald",
    features: [
      "Tudo no plano Equipa",
      "Acompanhamento mais próximo",
      "Apoio inicial na adoção",
      "Ideal para beta pago",
    ],
  },
];

const faqs = [
  {
    question: "Para quem é o Ponto Inteligente?",
    answer:
      "Foi pensado para profissionais independentes, microempresas e pequenas equipas que querem controlar a jornada sem complicação.",
  },
  {
    question: "Funciona bem para pequenas equipas?",
    answer:
      "Sim. A proposta atual é precisamente servir equipas pequenas com um fluxo simples, rápido e fácil de acompanhar.",
  },
  {
    question: "Calcula horas extra?",
    answer:
      "Sim, o sistema apresenta o excedente acima da base diária configurada no resumo. Regras laborais específicas devem ser validadas no contexto de cada empresa.",
  },
  {
    question: "Posso começar já?",
    answer:
      "Sim. Já pode criar conta e começar a usar a plataforma, enquanto a oferta comercial continua a evoluir.",
  },
];

function AccentDot() {
  return <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />;
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_35%),linear-gradient(180deg,#07111f_0%,#0f172a_45%,#111827_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-emerald-400 shadow-lg shadow-blue-950/30">
              <Clock3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-slate-200 uppercase">
                Ponto Inteligente
              </p>
              <p className="text-xs text-slate-400">alegomes.eu</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="#pricing" className="hidden text-sm text-slate-300 transition hover:text-white sm:inline">
              Ver preços
            </Link>
            <Link href="/time-record">
              <Button className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
                Entrar
              </Button>
            </Link>
          </div>
        </motion.header>

        <section className="relative py-18 sm:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 h-72 bg-[radial-gradient(circle,rgba(16,185,129,0.16),transparent_55%)] blur-2xl" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                <AccentDot />
                Beta pago para pequenas equipas em Portugal
              </div>

              <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
                Controle de ponto simples
                <span className="block bg-linear-to-r from-blue-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  para equipas pequenas.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Software simples de controlo de ponto e registo de horas para pequenas equipas em Portugal.
                Registe entradas e saídas, consulte o histórico e acompanhe o resumo mensal sem complicação.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="#pricing">
                  <Button size="lg" className="min-w-48 rounded-full bg-blue-600 px-8 text-white hover:bg-blue-500">
                    <Euro className="mr-2 h-5 w-5" />
                    Ver preços
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-48 rounded-full border-white/15 bg-white/5 px-8 text-white hover:bg-white/10 hover:text-white"
                  >
                    Criar conta
                  </Button>
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-200 backdrop-blur"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -left-10 top-12 hidden h-24 w-24 rounded-full bg-blue-500/20 blur-2xl lg:block" />
              <div className="absolute -right-8 bottom-10 hidden h-32 w-32 rounded-full bg-emerald-400/15 blur-2xl lg:block" />

              <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm text-slate-400">Resumo da equipa</p>
                    <h2 className="mt-1 text-2xl font-semibold text-white">Visão rápida da jornada</h2>
                  </div>
                  <BadgeCheck className="h-8 w-8 text-emerald-300" />
                </div>

                <div className="grid gap-4 py-6 sm:grid-cols-3">
                  <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                    <p className="text-sm text-blue-200">Horas registadas</p>
                    <p className="mt-2 text-3xl font-semibold text-white">168h</p>
                    <p className="mt-1 text-xs text-blue-100/80">exemplo mensal</p>
                  </div>
                  <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                    <p className="text-sm text-amber-100">Horas extra</p>
                    <p className="mt-2 text-3xl font-semibold text-white">12h</p>
                    <p className="mt-1 text-xs text-amber-100/80">leitura rápida</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-sm text-emerald-100">Dias acompanhados</p>
                    <p className="mt-2 text-3xl font-semibold text-white">21</p>
                    <p className="mt-1 text-xs text-emerald-100/80">dados de exemplo</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    ["Registo rápido", "Entradas e saídas com poucos cliques"],
                    ["Histórico claro", "Conferência simples por dia e por mês"],
                    ["Leitura imediata", "Resumo visual sem depender de folhas de cálculo"],
                  ].map(([title, description]) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                      <div>
                        <p className="font-medium text-white">{title}</p>
                        <p className="text-sm text-slate-400">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-10">
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Card className="h-full rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500/25 to-emerald-400/25">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">Preços</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Planos simples para começar com clareza.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Escolha o plano que melhor se adapta ao ritmo da sua atividade e comece a registar a jornada
              sem complicação.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => {
              const accentClasses =
                plan.accent === "blue"
                  ? "border-blue-400/40 bg-blue-500/10"
                  : plan.accent === "emerald"
                    ? "border-emerald-400/35 bg-emerald-400/10"
                    : "border-white/10 bg-white/5";

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  viewport={{ once: true }}
                >
                  <Card
                    className={`relative h-full rounded-[2rem] border p-7 backdrop-blur ${accentClasses} ${
                      plan.featured ? "shadow-2xl shadow-blue-950/40" : ""
                    }`}
                  >
                    {plan.featured ? (
                      <div className="absolute right-5 top-5 rounded-full bg-blue-400 px-3 py-1 text-xs font-semibold text-slate-950">
                        Mais indicado
                      </div>
                    ) : null}

                    <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{plan.name}</p>
                    <div className="mt-5 flex items-end gap-1">
                      <span className="text-5xl font-semibold text-white">{plan.price}</span>
                      <span className="pb-2 text-slate-300">{plan.cadence}</span>
                    </div>
                    <p className="mt-4 min-h-18 text-sm leading-7 text-slate-300">{plan.description}</p>

                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-slate-200">
                          <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 block">
                      <StripeCheckoutButton
                        kind="subscription"
                        plan={plan.key}
                        requireAuth
                        className={`w-full rounded-full ${
                          plan.featured
                            ? "bg-blue-500 text-white hover:bg-blue-400"
                            : "bg-white text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        {plan.cta}
                      </StripeCheckoutButton>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="py-8">
          <Card className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/10 p-8 backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-emerald-200">
                  <HeartHandshake className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-[0.2em]">Apoiar o projeto</span>
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-white">Quer ajudar a manter o Ponto Inteligente vivo?</h2>
                <p className="mt-4 text-sm leading-7 text-emerald-50/90">
                  A doação é opcional e faz sentido como apoio ao projeto, para ajudar na evolução do produto,
                  melhorias contínuas e novos recursos ao longo do tempo.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {[5, 10, 20].map((amount) => (
                  <StripeCheckoutButton
                    key={amount}
                    kind="donation"
                    amount={amount}
                    className="rounded-full bg-white text-emerald-900 hover:bg-emerald-50"
                  >
                    Doar €{amount}
                  </StripeCheckoutButton>
                ))}
                <DonationCheckoutForm />
              </div>
            </div>
          </Card>
        </section>

        <section className="py-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              viewport={{ once: true }}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur"
            >
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-200">O que já resolve</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Tudo o que precisa para começar sem confusão.</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
                <p>O Ponto Inteligente foi pensado para equipas que querem sair do Excel sem entrar num software pesado.</p>
                <p>O foco está na rapidez do registo, clareza do histórico e leitura simples da jornada.</p>
                <p>Uma experiência direta, prática e fácil de adotar no dia a dia.</p>
              </div>
            </motion.div>

            <div className="grid gap-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  viewport={{ once: true }}
                >
                  <Card className="rounded-[1.6rem] border border-white/10 bg-slate-950/40 p-6 backdrop-blur">
                    <div className="flex items-start gap-4">
                      <CalendarRange className="mt-1 h-5 w-5 text-cyan-200" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-300">{faq.answer}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
            className="rounded-[2.25rem] border border-white/10 bg-linear-to-r from-blue-600/20 via-cyan-400/10 to-emerald-400/20 px-8 py-10 text-center backdrop-blur"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-100">Começar agora</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Comece hoje a organizar a jornada da sua equipa.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              Crie conta, escolha o plano certo e acompanhe entradas, saídas e resumos mensais com mais
              clareza e menos trabalho manual.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="rounded-full bg-white px-8 text-slate-900 hover:bg-slate-100">
                  Criar conta
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/20 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
                >
                  Entrar na plataforma
                </Button>
              </Link>
              <Link href="/billing">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-emerald-300/30 bg-emerald-400/10 px-8 text-white hover:bg-emerald-400/15 hover:text-white"
                >
                  Gerir faturação
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-400">
          <p>© 2026 Ponto Inteligente. Registo simples e fiável da jornada de trabalho.</p>
        </footer>
      </div>
    </div>
  );
}
