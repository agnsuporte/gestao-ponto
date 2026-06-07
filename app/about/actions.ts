
'use server'

import { Resend } from "resend"
import { headers } from "next/headers"
import { LRUCache } from "lru-cache"
import { contactSchema } from "./schema"
import { env } from "@/env"

export type ActionState = {
  success?: boolean
  errors?: {
    name?: string[]
    email?: string[]
    message?: string[]
    global?: string[]
  }
}

// Inicializa a SDK do Resend
const resend = new Resend(env.RESEND_API_KEY)

// Protege a VPS de 2GB limitando a 3 requisições por minuto por IP
const rateLimitCache = new LRUCache<string, number>({
  max: 1000,
  ttl: 60 * 1000,
})

export async function handleContactSubmit(
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  
  // 1. DEFESA HONEYPOT: Se o bot preencheu o campo invisível 'website'
  const honeymoonField = formData.get("website")
  if (honeymoonField) {
    console.warn("🛡️ Bot travado silenciosamente via Honeypot.")
    return { success: true } // Resposta falsa positiva para desarmar o script do bot
  }

  // 2. DEFESA RATE LIMITING: Captura o IP na VPS e bloqueia flooding
  const headerList = await headers()
  const ip = headerList.get("x-forwarded-for") || "anonymous"
  const currentRequests = rateLimitCache.get(ip) || 0
  
  if (currentRequests >= 3) {
    return {
      success: false,
      errors: { global: ["Demasiadas tentativas. Por favor, aguarde um minuto para proteção do servidor."] }
    }
  }
  rateLimitCache.set(ip, currentRequests + 1)

  // 3. DEFESA ZOD: Validação estrita de tipos
  const rawFormData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  }

  const validatedFields = contactSchema.safeParse(rawFormData)
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, message } = validatedFields.data

  // 4. DISPARO VIA RESEND (Custo Zero / Alta Entrega)
  try {
    await resend.emails.send({
      from: 'ClicPonto Suporte <suporte@clicponto.com>', // Disparado pelo seu domínio próprio
      to: env.CONTACT_RECEIVER_EMAIL,
      replyTo: email, // Quando clicar em "Responder" no seu e-mail, vai para o cliente
      subject: `[Contacto] ${name} enviou uma mensagem`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #111; border-bottom: 2px solid #e4e4e7; padding-bottom: 10px;">Nova Mensagem via ClicPonto</h2>
          <p><strong>Nome do Cliente:</strong> ${name}</p>
          <p><strong>E-mail de Contacto:</strong> ${email}</p>
          <div style="background-color: #f4f4f5; padding: 15px; border-radius: 6px; margin-top: 15px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error("Erro na API do Resend:", error)
    return {
      success: false,
      errors: { global: ["Erro ao processar o envio através do Resend. Tente mais tarde."] }
    }
  }
}
