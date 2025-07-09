FROM node:latest

# Cria e define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência primeiro (melhora cache)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante da aplicação
COPY . .

# Expõe as portas usadas pela aplicação e Prisma Studio
EXPOSE 3000 5555

# Comando padrão para desenvolvimento
CMD ["npm", "run", "start:dev"]
