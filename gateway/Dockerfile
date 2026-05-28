FROM node:latest
WORKDIR /app
COPY . .
RUN npm install express cors path cookie-parser
ENTRYPOINT node server.js