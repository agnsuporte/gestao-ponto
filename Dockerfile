# FROM node:20-slim AS builder
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# RUN apt-get update -y && apt-get install -y openssl libssl-dev

# COPY . .

# RUN npx prisma generate

# RUN npm run build

# # ----------------------------

# FROM node:20-slim AS runner
# WORKDIR /app

# ENV NODE_ENV=production

# COPY --from=builder /app/next.config* ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/prisma ./prisma

# EXPOSE 3000

# CMD ["npm", "start"]

FROM node:20-slim AS builder
WORKDIR /app

# Instala dependências necessárias para compilar o Prisma
RUN apt-get update -y && apt-get install -y openssl libssl-dev

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# ----------------------------

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# --- O SEGREDO ESTÁ AQUI ---
# O runtime também precisa do openssl instalado para ler o motor do Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/next.config* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Dica: 'prisma migrate deploy' garante que a DB atualiza no arranque
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
