Guia de Resolução: Prisma + OpenSSL no Docker (Debian/Ubuntu)
1. O Problema
O Prisma Engine não encontrava a biblioteca libssl dentro do contentor Docker, impossibilitando comandos como db pull ou migrate.
2. Solução Imediata (Fix Temporário no Contentor Vivo)
Se o erro aparecer num contentor que já está a correr:
bash
# Entrar como root e instalar as dependências
docker exec -u 0 -it stack-app-1 apt-get update
docker exec -u 0 -it stack-app-1 apt-get install -y openssl libssl-dev
Use o código com cuidado.

3. Solução Definitiva (Configuração no Dockerfile)
Para que o erro não volte ao recriar o contentor, adiciona estas linhas ao teu Dockerfile:
dockerfile
# Instala bibliotecas de sistema necessárias para o Prisma Engine
RUN apt-get update -y && apt-get install -y \
    openssl \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*
Use o código com cuidado.

4. Configuração do schema.prisma
Para garantir que o Prisma usa a engine correta (Debian Bookworm usa OpenSSL 3.0):
prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
Use o código com cuidado.

5. Comandos de Manutenção (Fluxo de Trabalho)
Sempre que alterares o esquema ou o ambiente:
bash
# 1. Gerar o cliente novamente
docker exec -it stack-app-1 npx prisma generate

# 2. Aplicar migrações
docker exec -it stack-app-1 npx prisma migrate dev

# 3. Se precisar trazer o banco para o código
docker exec -it stack-app-1 npx prisma db pull
Use o código com cuidado.

Dica Extra: Se planeares atualizar para a versão 7.7.0 (como sugerido no teu log), lembra-te de atualizar tanto o pacote prisma como o @prisma/client no teu package.json.
Precisas de ajuda para configurar o script de deploy automático com estas correções?