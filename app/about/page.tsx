'use client'

import { useActionState, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BackButton } from "@/components/BackButton"
import { handleContactSubmit, ActionState } from "./actions"

export default function AboutPage() {
  // Inicializa o estado do formulário ligado à Server Action com Zod
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    handleContactSubmit,
    { success: false }
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-16 space-y-12">

      {/* Botão Voltar Otimizado para Mobile */}
      <BackButton />

      {/* Secção Sobre */}
      <section className="space-y-4 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Sobre o Projeto
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Bem-vindo ao nosso ecossistema de gestão. Este projeto foi desenhado meticulosamente 
          para oferecer a máxima eficiência e automação nas suas jornadas diárias.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Informações de Contacto Adicionais */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">A nossa Missão</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>• Simplificar fluxos operacionais complexos.</p>
              <p>• Garantir alta segurança de dados.</p>
              <p>• Manter um design intuitivo baseado em padrões de acessibilidade.</p>
            </CardContent>
          </Card>
        </div>

        {/* Formulário de Contacto com Feedback do Zod */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Entrar em Contacto</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para nos enviar uma mensagem diretamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.success ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-medium text-center">
                Mensagem enviada com sucesso! Entraremos em contacto em breve.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="absolute opacity-0 -z-10 pointer-events-none select-none">
                    <label htmlFor="website">Não preencha este campo se for humano</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                {/* Campo Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="O seu nome" 
                    className="h-11"
                  />
                  {state.errors?.name && (
                    <p className="text-xs font-medium text-destructive">{state.errors.name[0]}</p>
                  )}
                </div>
                
                {/* Campo E-mail */}
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="exemplo@email.com" 
                    className="h-11"
                  />
                  {state.errors?.email && (
                    <p className="text-xs font-medium text-destructive">{state.errors.email[0]}</p>
                  )}
                </div>
                
                {/* Campo Mensagem */}
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="Como podemos ajudar?" 
                    className="min-h-[120px] resize-none"
                  />
                  {state.errors?.message && (
                    <p className="text-xs font-medium text-destructive">{state.errors.message[0]}</p>
                  )}
                </div>

                {/* Erros Gerais do Servidor */}
                {state.errors?.global && (
                  <p className="text-sm font-medium text-destructive text-center">{state.errors.global[0]}</p>
                )}

                {/* Botão com Estado de Loading e Efeito Mobile */}
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full md:w-auto md:px-8 h-11 font-medium transition-transform active:scale-[0.98]"
                >
                  {isPending ? "A enviar..." : "Enviar Mensagem"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
