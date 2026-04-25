import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import prisma from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET não configurada' }, { status: 500 });
  }

  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Assinatura Stripe em falta' }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook inválido';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'subscription' && typeof session.subscription === 'string') {
          const customerId =
            typeof session.customer === 'string'
              ? session.customer
              : session.customer?.id;

          if (customerId) {
            await prisma.user.updateMany({
              where: { stripeCustomerId: customerId },
              data: {
                stripeSubscriptionId: session.subscription,
                billingStatus: 'active',
              },
            });
          }
        }

        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id;

        const priceId = subscription.items.data[0]?.price.id;
        const normalizedStatus =
          subscription.status === 'active' || subscription.status === 'trialing'
            ? 'active'
            : subscription.status;

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            billingStatus: normalizedStatus,
          },
        });

        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao processar webhook';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
