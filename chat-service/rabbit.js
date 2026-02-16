const amqp = require("amqplib");
const { User, Message, Friendship } = require("./models");

let channel = null;
let connection = null;

async function connectToRabbitMQ() {
  const amqpServer = "amqp://guest:guest@localhost:5672";
  connection = await amqp.connect(amqpServer);

  channel = await connection.createChannel();

  await channel.assertExchange("user.events.exchange", "direct", { durable: true });

  const addedQueue = await channel.assertQueue("chat.user.added.queue");
  const deletedQueue = await channel.assertQueue("chat.user.deleted.queue");

  await channel.bindQueue(addedQueue.queue, "user.events.exchange", "user.added"); 
  await channel.bindQueue(deletedQueue.queue, "user.events.exchange", "user.deleted");

  channel.consume(addedQueue.queue, async (msg) => {
    const data = JSON.parse(msg.content.toString());
    const userId = data.userId;

    console.log("Chat-service got event user.added", userId);

    await User.create({id: userId});

    channel.ack(msg);
  });

  channel.consume(deletedQueue.queue, async (msg) => {
    const data = JSON.parse(msg.content.toString());
    const userId = data.userId;

    console.log("Chat-service got event user.deleted", userId);

    await User.destroy({ where: { id: userId } });
    
    channel.ack(msg);
  });

  return channel;
}; 

function getChannel() {
  return channel;
}

module.exports = { connectToRabbitMQ, getChannel };