"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

type StripeCheckoutButtonProps = {
  kind: 'subscription' | 'donation';
  plan?: 'solo' | 'equipa' | 'piloto';
  amount?: number;
  children: React.ReactNode;
  className?: string;
  variant?: React.ComponentProps<typeof Button>['variant'];
  size?: React.ComponentProps<typeof Button>['size'];
  requireAuth?: boolean;
  disabled?: boolean;
};

export function StripeCheckoutButton({
  kind,
  plan,
  amount,
  children,
  className,
  variant,
  size,
  requireAuth = false,
  disabled = false,
}: StripeCheckoutButtonProps) {
  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (requireAuth && status !== 'authenticated') {
      router.push('/register?next=/billing');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kind,
          plan,
          amount,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }

        throw new Error(data.error ?? 'Não foi possível iniciar o checkout');
      }

      window.location.assign(data.url);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível iniciar o checkout';
      window.alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isLoading || disabled}
    >
      {isLoading ? 'A encaminhar...' : children}
    </Button>
  );
}
