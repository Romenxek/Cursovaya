FROM node:latest
WORKDIR /marker-service
COPY . .
RUN npm install express cors path cookie-parser sequelize sequelize-cli mysql2 amqplib dotenv jsonwebtoken
CMD ["node", "server.js"]