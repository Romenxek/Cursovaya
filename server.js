const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const cookieParser = require('cookie-parser');

const markersRoutes = require('./routes/markers');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const routeORS = require('./routes/route');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Роуты
app.use('/markers', markersRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/route', routeORS);

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});

