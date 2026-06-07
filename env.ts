// import { z } from "zod"

// const envSchema = z.object({
//   // Configurações do Gmail/Nodemailer
//   GMAIL_USER: z.string().email("O GMAIL_USER deve ser um e-mail válido."),
//   GMAIL_APP_PASSWORD: z.string().min(1, "A GMAIL_APP_PASSWORD é obrigatória."),
//   CONTACT_RECEIVER_EMAIL: z.string().email("O e-mail de destino deve ser válido."),

//   // Infraestrutura e Stripe (Já mapeado para o seu contexto atual)
//   STRIPE_SECRET_KEY: z.string().min(1, "A Stripe Secret Key é obrigatória.").optional(),
//   NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
// })

// // Executa a validação imediatamente ao importar o ficheiro
// const parseResult = envSchema.safeParse(process.env)

// if (!parseResult.success) {
//   console.error("❌ Variáveis de ambiente inválidas ou em falta:")
//   console.error(JSON.stringify(parseResult.error.format(), null, 2))
  
//   // Bloqueia o arranque do build ou do servidor para evitar falhas em produção
//   throw new Error("Variáveis de ambiente inválidas. Corrija o ficheiro .env.local.")
// }

// export const env = parseResult.data
import { z } from "zod"

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1, "A RESEND_API_KEY é obrigatória."),
  CONTACT_RECEIVER_EMAIL: z.string().email("O e-mail de destino deve ser válido."),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

const parseResult = envSchema.safeParse(process.env)

if (!parseResult.success) {
  console.error("❌ Variáveis de ambiente inválidas:")
  console.error(JSON.stringify(parseResult.error.format(), null, 2))
  throw new Error("Corrija o ficheiro .env.local.")
}

export const env = parseResult.data
