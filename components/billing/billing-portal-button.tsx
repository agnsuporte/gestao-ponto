"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

type BillingPortalButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: React.ComponentProps<typeof Button>['variant'];
  size?: React.ComponentProps<typeof Button>['size'];
};

export function BillingPortalButton({
  children,
  className,
  variant,
  size,
}: BillingPortalButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }

        throw new Error(data.error ?? 'Não foi possível abrir a área de faturação');
      }

      window.location.assign(data.url);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível abrir a área de faturação';
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
      disabled={isLoading}
    >
      {isLoading ? 'A abrir...' : children}
    </Button>
  );
}
