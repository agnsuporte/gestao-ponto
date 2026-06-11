import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NoReplyEmailTemplateProps {
  previewText: string;
  title: string;
  messageText: string;
}

export const NoReplyEmailTemplate = ({
  previewText,
  title,
  messageText,
}: NoReplyEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={heading}>{title}</Heading>
          <Hr style={hr} />
          {/* Quebra linhas de texto vindas da Textarea de forma correta */}
          <Text style={paragraph}>{messageText}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Esta é uma mensagem automática gerada pelo sistema ClicPonto. Por favor, não responda diretamente a este email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Estilos limpos e inline exigidos pelos clientes de email
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
};

const box = {
  padding: "0 20px",
};

const heading = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "32px",
  margin: "16px 0",
};

const paragraph = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  whiteSpace: "pre-line" as const, // Preserva parágrafos
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};
