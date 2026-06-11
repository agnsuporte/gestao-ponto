import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { EmailForm } from "./_components/email-form";
import { BackButton } from "@/components/BackButton";

export default async function AdminEmailPage() {
  const session = await getServerSession(authOptions);

  // Agora validamos pelo papel (role) injetado com segurança pelo NextAuth
  const isAdmin = session?.user?.role === "admin"; 
  if (!isAdmin) {
    redirect("/"); // Redireciona utilizadores comuns ou deslogados
  }

  return (
    <main className="container max-w-2xl mx-auto min-h-screen py-10 px-4">

      <div className="space-y-2 mb-8">
        {/* Botão Voltar Otimizado para Mobile */}
        <BackButton />
      </div>

      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Painel de Emails</h1>
        <p className="text-muted-foreground text-sm">
          A enviar notificações oficiais via <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">no-reply</code>
        </p>
      </div>
      
      <EmailForm />
    </main>
  );
}
