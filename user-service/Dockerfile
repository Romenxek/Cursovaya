FROM node:latest
WORKDIR /user-service
COPY . .
RUN npm install express cors path cookie-parser sequelize sequelize-cli mysql2 amqplib jsonwebtoken bcrypt dotenv
CMD ["node", "server.js"]