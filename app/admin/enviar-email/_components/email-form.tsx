"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Importações separadas corretamente:
import { emailSchema, EmailInput } from "../validation"; // O Zod Schema vem daqui
import { sendNoReplyEmail } from "../actions"; // A Server Action vem daqui

// Componentes Shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmailForm() {
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>({});
  const [isPending, setIsPending] = useState(false);

  const form = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    defaultValues: { to: "", subject: "", html: "" },
  });

  async function onSubmit(data: EmailInput) {
    setIsPending(true);
    setStatus({});
    
    const result = await sendNoReplyEmail(data);
    setIsPending(false);

    if (result.success) {
      setStatus({ success: true, message: "Email enviado com sucesso!" });
      form.reset();
    } else {
      setStatus({ success: false, message: result.error || "Erro ao enviar." });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Nova Mensagem</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destinatários (separados por vírgula)</FormLabel>
                  <FormControl>
                    {/* Usamos input do tipo text normal para o browser permitir as vírgulas */}
                    <Input 
                      type="text" 
                      placeholder="exemplo1@email.com, exemplo2@email.com" 
                      {...field} 
                      disabled={isPending} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto</FormLabel>
                  <FormControl>
                    <Input placeholder="Atualização importante da sua conta" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="html"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo (HTML ou Texto)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Olá! Seguem os detalhes do seu plano..." 
                      className="min-h-[150px] resize-none" 
                      {...field} 
                      disabled={isPending} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {status.message && (
              <div className={`p-3 rounded-lg text-sm font-medium ${
                status.success ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
              }`}>
                {status.message}
              </div>
            )}

            {/* Botão otimizado para mobile (full-width no telemóvel, centrado e active:scale) */}
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full sm:w-auto sm:px-8 mx-auto block active:scale-[0.98] transition-transform dynamic-touch-area"
            >
              {isPending ? "A enviar..." : "Enviar Email"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
