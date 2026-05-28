FROM node:latest
WORKDIR /chat-service
COPY . .
RUN npm install express cors path cookie-parser sequelize sequelize-cli mysql2 amqplib dotenv
CMD ["node", "server.js"]