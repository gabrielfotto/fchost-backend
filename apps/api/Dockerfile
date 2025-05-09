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
RUN npm run build

# Expor a porta
# EXPOSE 8080

# Copiar o entrypoint
COPY docker-entrypoint-apps.sh /usr/local/bin/docker-entrypoint-apps.sh
RUN chmod +x /usr/local/bin/docker-entrypoint-apps.sh

# Rodar o entrypoint customizado
ENTRYPOINT ["/usr/local/bin/docker-entrypoint-apps.sh"]

# Somente para ambiente DEV
# CMD ["npm", "run", "start:debug:api"]

