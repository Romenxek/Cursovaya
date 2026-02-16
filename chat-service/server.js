const express = require('express');
const cors = require('cors');

const { connectToRabbitMQ } = require("./rabbit");

const photoRoutes = require('./routes/chat');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/chat', photoRoutes);

const PORT = 3003;
(async () => {
  const channel = await connectToRabbitMQ();

  app.use('/chat', photoRoutes(channel));

  app.listen(PORT, () => {
    console.log(`Chat service running on http://localhost:${PORT}`);
  });
})();