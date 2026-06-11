"use server";

import { Resend } from "resend";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { emailSchema, EmailInput } from "./validation";
import { NoReplyEmailTemplate } from "./_templates/no-reply-template";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNoReplyEmail(data: EmailInput) {
  const session = await getServerSession(authOptions);

  // Agora validamos pelo papel (role) injetado com segurança pelo NextAuth
  const isAdmin = session?.user?.role === "admin"; 

  if (!isAdmin) {
    return { success: false, error: "Acesso negado." };
  }

  const validatedFields = emailSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, error: "Dados inválidos." };
  }

  try {
    const { to, subject, html } = validatedFields.data;
    const recipients = to.split(",").map((email) => email.trim());

    // 1. Renderiza o HTML uma única vez
    const emailHtml = await render(
      NoReplyEmailTemplate({
        previewText: subject,
        title: subject,
        messageText: html,
      })
    );

    // 2. Prepara o lote de emails no formato que o Resend Batch exige
    const batchPayload = recipients.map((recipient) => ({
      from: "ClicPonto <no-reply@clicponto.com>",
      to: [recipient], // Envio individual para cada um
      subject: subject,
      html: emailHtml,
    }));

    // 3. Divide o array em sub-lotes de 100 (limite máximo do Resend por chamada)
    const chunkSize = 100;
    for (let i = 0; i < batchPayload.length; i += chunkSize) {
      const chunk = batchPayload.slice(i, i + chunkSize);
      
      // Envia até 100 emails de uma só vez consumindo quase zero RAM da sua VPS
      const response = await resend.batch.send(chunk);

      if (response.error) {
        return { success: false, error: `Erro no lote: ${response.error.message}` };
      }
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro interno ao processar o envio em massa." };
  }
}
