const express = require('express');
const cors = require('cors');
const { connectToRabbitMQ } = require("./rabbit");

const deleteRoutes = require('./routes/delete');
const markersRoutes = require('./routes/markers');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;
(async () => {
  const channel = await connectToRabbitMQ();

  app.use('/marker/delete', deleteRoutes(channel));
  app.use('/marker/markers', markersRoutes(channel));
  app.use('/marker/user', userRoutes(channel));

  app.listen(PORT, () => {
    console.log(`Marker service running on http://localhost:${PORT}`);
  });
})();