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

# OUTRA ALTERNATIVA (FUNCIONOU) 
docker exec -u 0 -it stack-app-1 sh -c "apt-get update && apt-get install -y openssl libssl-dev"

Gera novamente o cliente dentro do contentor:
docker exec -it stack-app-1 npx prisma generate

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

# ---------------------------
# DOCKERFILE
# ---------------------------

O que foi corrigido:

a) Instalação no Runner: 

  Adicionei o apt-get install -y openssl na fase final (runner). Sem isto, o 
  ficheiro .so do Prisma não tem a biblioteca de suporte para correr.

b) Limpeza de Cache: 
  
  Usei rm -rf /var/lib/apt/lists/* para manter a imagem leve.

c) Comando de Arranque: 
  
  Alterei o CMD para correr as migrações automaticamente antes de iniciar a app. 
  Isso evita que a app quebre se adicionares campos novos à base de dados.

Como aplicar agora:

Basta correr docker-compose up --build -d app.

Sempre que fizeres grandes alterações no código, lembra-te da sequência:

docker compose build app (docker compose up --build -d app)
docker compose up -d

d) pgAdmin4

$ docker compose start pgadmin
$ docker compose stop pgadmin


stripe listen --forward-to localhost:3000/api/stripe/webhook

1. Criar o Backup na VPSAceda à sua VPS via terminal e execute o seguinte comando para gerar o backup a partir do contentor Docker:
# docker exec -t a4185814ec54 pg_dump -U deploy records > backup_db.sql

2. Baixar o Arquivo para o seu PC (Local)Agora, no terminal do seu computador local (não dentro da VPS), use o comando SCP para descarregar o arquivo:
# scp deploy@187.33.159.187:/opt/stack/backup_db.sql ./

O SCP (Secure Copy Protocol) é uma ferramenta de linha de comando que permite copiar ficheiros ou pastas entre computadores de forma segura, utilizando o protocolo SSH para encriptar os dados durante a transferência.

A lógica do comando é sempre: 
* scp [origem] [destino].

A Estrutura do ComandoQuando copias algo de um servidor remoto para o teu PC, a estrutura detalhada é esta:
# bash$ scp utilizador@servidor:/caminho/do/ficheiro  /caminho/no/teu/pc
Use o código com cuidado.
utilizador: O nome de utilizador que usas para entrar na VPS (ex: root ou ubuntu).
@servidor: O endereço IP ou domínio da tua VPS.:
: Este dois-pontos é obrigatório; ele separa o endereço do servidor do caminho do ficheiro./caminho/do/ficheiro: O local exato na VPS onde está o teu backup./caminho/no/teu/pc: Onde queres que o ficheiro "aterre" (podes usar apenas . para indicar a pasta onde estás no momento).

Casos Comuns de Uso
# Baixar um ficheiro da VPS:
  * scp root@1.2.3.4:/home/backup.sql .(Copia o ficheiro para a pasta atual do teu PC)
  
# Enviar um ficheiro do teu PC para a VPS:
  * scp script.sh root@1.2.3.4:/tmp/(O ficheiro local vai para a pasta /tmp da VPS)

# Baixar uma pasta inteira (usando o -r de recursivo):
  * scp -r root@1.2.3.4:/var/www/html ./meu_site_backup

Se usas uma porta SSH diferente (ex: porta 2222):
scp -P 2222 root@1.2.3.4:/caminho/ficheiro . 
(Nota: o -P é maiúsculo no SCP)

Por que é bom usar?
Diferente do FTP tradicional, o SCP já vem instalado em quase todos os sistemas (Linux, Mac e Windows 10/11) e aproveita as mesmas chaves de acesso e segurança que já usas para o teu SSH normal.