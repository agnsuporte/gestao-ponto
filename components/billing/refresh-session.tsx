'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function RefreshSession() {
  const { update } = useSession();

  useEffect(() => {
    // Atualiza a sessão silenciosamente assim que a página de sucesso carrega
    update();
  }, [update]);

  return null; // Não renderiza nada visualmente
}
