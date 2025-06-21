# Base image
FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Copiar os arquivos package.json e package-lock.json da raiz
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todos os arquivos do projeto para o container
COPY . .

# Criar a pasta dist (build)
RUN npm run build:api

# Expor a porta
EXPOSE 8080

# Copiar o entrypoint
COPY docker-entrypoint-apps.sh /usr/local/bin/docker-entrypoint-apps.sh
RUN chmod +x /usr/local/bin/docker-entrypoint-apps.sh

# Rodar o entrypoint customizado
ENTRYPOINT ["/usr/local/bin/docker-entrypoint-apps.sh"]

# Somente para ambiente DEV
# CMD ["npm", "run", "start:debug:api"]



# # Build stage
# FROM node:22-alpine AS builder

# # Create app directory
# WORKDIR /usr/src/app

# # Copiar os arquivos package.json e package-lock.json da raiz
# COPY package*.json ./

# # Instalar TODAS as dependências (incluindo devDependencies)
# RUN npm ci

# # Copiar todos os arquivos do projeto para o container
# COPY . .

# # Criar a pasta dist (build)
# RUN node scripts/build-libs.js && \
#     npm run build:api

# # Production stage
# FROM node:22-alpine

# # Create app directory
# WORKDIR /usr/src/app

# # Copiar os arquivos package.json e package-lock.json da raiz
# COPY package*.json ./

# # Instalar apenas as dependências de produção e o @nestjs/cli globalmente
# RUN npm ci && \
#     npm install -g @nestjs/cli

# # Copiar apenas os arquivos necessários do stage de build
# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/libs ./libs
# COPY --from=builder /usr/src/app/tsconfig.json ./
# COPY --from=builder /usr/src/app/tsconfig.build.json ./
# COPY --from=builder /usr/src/app/nest-cli.json ./
# COPY --from=builder /usr/src/app/apps/api/tsconfig.app.json ./apps/api/
# COPY --from=builder /usr/src/app/scripts ./scripts

# # Copiar o entrypoint
# COPY docker-entrypoint-apps.sh /usr/local/bin/docker-entrypoint-apps.sh
# RUN chmod +x /usr/local/bin/docker-entrypoint-apps.sh

# # Expor a porta
# EXPOSE 8080

# # Rodar o entrypoint customizado
# ENTRYPOINT ["/usr/local/bin/docker-entrypoint-apps.sh"]

# # Somente para ambiente DEV
# # CMD ["npm", "run", "start:debug:api"]
