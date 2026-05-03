import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { billingStatus: 'free_trial' }
    });
  }

  // Redireciona para a página de sucesso para forçar o update da session
  redirect('/billing/success'); 
}
