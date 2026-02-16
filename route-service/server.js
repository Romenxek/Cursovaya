const express = require('express');
const cors = require('cors');

const routeRoutes = require('./routes/route');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/route', routeRoutes);

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Route service running on http://localhost:${PORT}`);
});
