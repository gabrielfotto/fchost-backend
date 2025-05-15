# Base image
FROM node:22

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build:invoice-consumer

# Copiar o entrypoint
COPY docker-entrypoint-apps.sh /usr/local/bin/docker-entrypoint-apps.sh
RUN chmod +x /usr/local/bin/docker-entrypoint-apps.sh

# Rodar o entrypoint customizado
ENTRYPOINT ["/usr/local/bin/docker-entrypoint-apps.sh"]

# Somente para ambiente DEV
# CMD ["npm", "run", "start:debug:invoice-consumer"]
