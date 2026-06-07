import { z } from "zod"

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
    .max(50, { message: "O nome não pode exceder 50 caracteres." }),
  email: z
    .string()
    .email({ message: "Introduza um endereço de e-mail válido." }),
  message: z
    .string()
    .min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." })
    .max(1000, { message: "A mensagem não pode exceder 1000 caracteres." }),
})

// Tipo TypeScript inferido automaticamente do esquema do Zod
export type ContactFormData = z.infer<typeof contactSchema>
