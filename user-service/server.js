const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { connectToRabbitMQ } = require("./rabbit");

const authRoutes = require('./routes/auth');
const deleteRoutes = require('./routes/delete');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = 3001;
(async () => {
  const channel = await connectToRabbitMQ();

  app.use('/auth', authRoutes(channel));
  app.use('/delete', deleteRoutes(channel));

  app.listen(PORT, () => {
    console.log(`User service running on http://localhost:${PORT}`);
  });
})();