FROM node:latest

# Set the working directory inside the container
# WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# RUN npm run build

CMD [ "npm" , "run" , "start:dev" ]