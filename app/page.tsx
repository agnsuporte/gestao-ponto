"use client";

// import { useSession } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { CheckCircle, Clock, TrendingUp, Zap } from "lucide-react";
// import Link from "next/link";

// export default  function HomePage() {
  
//   function AuthButton() {
//     const { data: session, status } = useSession();

//     if (status === "loading") return <Button>A carregar...</Button>;

//     return session ? (
//       <Link href="/api/auth/signout">
//         <Button>Sair</Button>
//       </Link>
//     ) : (
//       <Link href="/api/auth/signin">
//         <Button>Aceder</Button>
//       </Link>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen bg-slate-50 text-slate-900">
//       {/* Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
//         <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <Clock className="w-6 h-6 text-blue-600" />
//             <span className="text-xl font-bold">TimeSheet PT</span>
//           </div>
//           <nav className="flex items-center gap-4">
//             <AuthButton/>
//           </nav>
//         </div>
//       </header>

//       <main>
//         {/* Hero Section */}
//         <section className="relative pt-32 pb-20 text-center bg-white">
//           <div className="container mx-auto px-6">
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
//               <Zap className="w-4 h-4" />
//               <span>Gestão de Tempo Inteligente</span>
//             </div>
//             <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
//               Controle as suas horas, <br />
//               <span className="text-blue-600">maximize a sua produtividade.</span>
//             </h1>
//             <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
//               A nossa ferramenta simplifica o registo de horas de trabalho, calcula horas extras automaticamente e fornece relatórios detalhados, tudo em conformidade com a Lei.
//             </p>
//             <div className="flex justify-center gap-4">
//               <Link href="/time-record">
//                 <Button size="lg">Começar Agora</Button>
//               </Link>
//               <Link href="#features">
//                 <Button size="lg" variant="outline">
//                   Saber Mais
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </section>

//         {/* Features Section */}
//         <section id="features" className="py-20 bg-slate-50">
//           <div className="container mx-auto px-6">
//             <div className="text-center mb-12">
//               <h2 className="text-4xl font-bold mb-2">Funcionalidades Principais</h2>
//               <p className="text-slate-600">Tudo o que precisa para uma gestão de tempo eficiente.</p>
//             </div>
//             <div className="grid md:grid-cols-3 gap-8">
//               <Card>
//                 <CardHeader>
//                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
//                     <Clock className="w-6 h-6 text-blue-600" />
//                   </div>
//                   <CardTitle>Registo de Ponto Simples</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>Marque as suas entradas e saídas com apenas um clique. Interface rápida e intuitiva.</p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
//                     <TrendingUp className="w-6 h-6 text-blue-600" />
//                   </div>
//                   <CardTitle>Cálculo de Horas Extras</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>Cálculo automático de horas extraordinárias segundo o Código do Trabalho.</p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
//                     <CheckCircle className="w-6 h-6 text-blue-600" />
//                   </div>
//                   <CardTitle>Conformidade Legal</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>Garantimos que os cálculos estão de acordo com a legislação para evitar surpresas.</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="py-8 bg-slate-100 border-t border-slate-200">
//         <div className="container mx-auto px-6 text-center text-slate-500">
//           <p>&copy; {new Date().getFullYear()} TimeSheet PT. Todos os direitos reservados.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }


import  Link from 'next/link';
// import { createPageUrl } from '../utils';
import { Clock, TrendingUp, Calendar, Shield, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full mb-6 border border-blue-500/20">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Gestão de Tempo Simplificada</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6">
              Controle de Ponto
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400 mt-2 mb-2">
                Inteligente
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Registe as suas horas de trabalho de forma simples e eficiente. 
              Acompanhe o seu tempo, horas extras e produtividade em tempo real.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/time-record">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  <Clock className="w-5 h-5 mr-2" />
                  Aceder ao Ponto
                </Button>
              </Link>
             
            </div>
          </motion.div>

          {/* Floating cards animation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Registo Rápido</h3>
              <p className="text-slate-400 text-sm">
                Marque entrada e saída com um clique. Interface intuitiva e responsiva.
              </p>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Horas Extras</h3>
              <p className="text-slate-400 text-sm">
                Cálculo automático de horas extras conforme legislação portuguesa.
              </p>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Histórico Completo</h3>
              <p className="text-slate-400 text-sm">
                Consulte o histórico de registos e estatísticas mensais detalhadas.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Conforme a Legislação Portuguesa
            </h2>
            <p className="text-slate-300 mb-6">
              Sistema desenvolvido seguindo as normas do Código do Trabalho português, 
              incluindo cálculo automático de horas extras com as taxas corretas.
            </p>
            <ul className="space-y-4">
              {[
                'Período normal: 8h/dia, 40h/semana',
                'Primeiras 2h extras: +25%',
                'Horas seguintes: +37.5%',
                'Dias de descanso: +50%'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-slate-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300">Total Mensal</span>
                  <span className="text-2xl font-bold text-white">168h</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300">Horas Extras</span>
                  <span className="text-2xl font-bold text-amber-400">12h</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300">Dias Trabalhados</span>
                  <span className="text-2xl font-bold text-emerald-400">21</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Faça login e comece a gerir o seu tempo de forma inteligente.
          </p>
          <Link href="/time-record">
            <Button size="lg" className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-lg">
              <Users className="w-5 h-5 mr-2" />
              Aceder Agora
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
          <p>© 2026 Controle de Ponto. Sistema conforme legislação portuguesa.</p>
        </div>
      </div>
    </div>
  );
}