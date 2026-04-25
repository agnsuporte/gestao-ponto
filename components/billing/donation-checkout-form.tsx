"use client";

import { useState } from 'react';

import { StripeCheckoutButton } from '@/components/billing/stripe-checkout-button';

export function DonationCheckoutForm() {
  const [amount, setAmount] = useState('15');
  const normalizedAmount = Number(amount);
  const isValidAmount = Number.isFinite(normalizedAmount) && normalizedAmount >= 1 && normalizedAmount <= 500;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-full border border-emerald-200/40 bg-white/90 px-4 py-2 text-slate-900">
        <span className="mr-2 text-sm font-medium text-slate-500">€</span>
        <input
          type="number"
          min={1}
          max={500}
          step={1}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="w-24 bg-transparent text-sm font-medium outline-none"
          aria-label="Valor da doação"
        />
      </div>

      <StripeCheckoutButton
        kind="donation"
        amount={isValidAmount ? normalizedAmount : undefined}
        disabled={!isValidAmount}
        className="rounded-full bg-white text-emerald-900 hover:bg-emerald-50"
      >
        Doar valor livre
      </StripeCheckoutButton>
    </div>
  );
}
