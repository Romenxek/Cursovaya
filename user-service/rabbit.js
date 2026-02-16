const amqp = require('amqplib');

let channel = null;
let connection = null;

async function connectToRabbitMQ() {
  const amqpServer = "amqp://guest:guest@localhost:5672";
  connection = await amqp.connect(amqpServer);

  channel = await connection.createChannel();

  await channel.assertExchange("user.events.exchange", "direct", { durable: true });
  return channel;
}; 

function getChannel() {
  return channel;
}

module.exports = { connectToRabbitMQ, getChannel };