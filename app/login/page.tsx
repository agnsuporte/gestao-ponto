'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Email ou password incorretos');
      setIsLoading(false);
    } else {
      router.push('/time-record');
    }
  };

  const handleEmailLogin = async () => {
 
    if (!email) {
      setError('Insira o seu email primeiro');
      return;
    }
    setIsLoading(true);
    setError('');

    const result = await signIn('email', { email, redirect: false });
    
    setIsLoading(false);
    if (result?.error) {
      setError('Erro ao enviar email. Tente novamente.');
    } else {
      setEmailSent(true);
    }    
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Verifique o seu email</h2>
          <p className="text-slate-500">Enviámos um link de acesso para <strong>{email}</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Controle de Ponto</h1>
          <p className="text-slate-500 mt-2">Aceda à sua conta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Email/Password Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 outline-none transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0 outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-800 text-white font-medium py-3 px-4 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'A entrar...' : 'Entrar'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleEmailLogin}
            disabled={isLoading}
            className="w-full mt-3 text-slate-600 font-medium py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors text-sm"
          >
            Enviar link de acesso por email
          </button>

          <p className="text-center text-slate-500 text-sm mt-6">
            Não tem conta?{' '}
            <Link href="/register" className="text-slate-800 font-medium hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}