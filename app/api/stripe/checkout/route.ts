import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import {
  getBaseUrl,
  getPlanPriceId,
  getStripe,
  isStripePlanKey,
  normalizeDonationAmount,
} from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      kind?: 'subscription' | 'donation';
      plan?: string;
      amount?: number;
    };

    const stripe = getStripe();
    const baseUrl = getBaseUrl();

    if (body.kind === 'donation') {
      const amount = normalizeDonationAmount(body.amount);

      if (!amount) {
        return NextResponse.json({ error: 'Valor de doação inválido' }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        submit_type: 'donate',
        success_url: `${baseUrl}/billing/success?kind=donation`,
        cancel_url: `${baseUrl}/billing/cancel?kind=donation`,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'eur',
              unit_amount: amount * 100,
              product_data: {
                name: 'Doação ao projeto Ponto Inteligente',
                description: 'Apoio opcional para manter o projeto vivo e evoluir a plataforma.',
              },
            },
          },
        ],
        metadata: {
          kind: 'donation',
          donationAmount: String(amount),
        },
      });

      return NextResponse.json({ url: session.url });
    }

    if (body.kind !== 'subscription' || !body.plan || !isStripePlanKey(body.plan)) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 });
    }

    let customerId = user.stripeCustomerId ?? undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: {
          userId: user.id,
        },
      });

      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId: customerId,
        },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      success_url: `${baseUrl}/billing/success?kind=subscription`,
      cancel_url: `${baseUrl}/billing/cancel?kind=subscription`,
      line_items: [
        {
          price: getPlanPriceId(body.plan),
          quantity: 1,
        },
      ],
      metadata: {
        kind: 'subscription',
        userId: user.id,
        plan: body.plan,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          plan: body.plan,
        },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar sessão de checkout';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
