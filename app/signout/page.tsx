"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = async () => {
    setIsSubmitting(true);

    const result = await signOut({
      redirect: false,
      callbackUrl: `${window.location.origin}/`,
    });

    window.location.assign(result?.url ?? "/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4">
            <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Terminar sessão?</h1>
          <p className="mt-2 text-slate-500">Terás de introduzir as tuas credenciais novamente para aceder.</p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleSignOut}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
          >
            {isSubmitting ? "A sair..." : "Sim, sair agora"}
          </button>
          <button
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </main>
  );
}
