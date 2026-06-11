import { z } from "zod";

export const emailSchema = z.object({
  to: z
    .string()
    .min(1, "O campo de destino é obrigatório.")
    .refine(
      (val) => {
        // Divide por vírgulas, limpa os espaços e valida cada email individualmente
        const emails = val.split(",").map((email) => email.trim());
        return emails.every((email) => z.string().email().safeParse(email).success);
      },
      {
        message: "Um ou mais emails inseridos são inválidos (separe-os por vírgula).",
      }
    ),
  subject: z.string().min(3, "O assunto deve ter pelo menos 3 caracteres."),
  html: z.string().min(10, "O conteúdo deve ter pelo menos 10 caracteres."),
});

export type EmailInput = z.infer<typeof emailSchema>;
