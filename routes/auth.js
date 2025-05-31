const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

const ACCESS_SECRET = 'SecretForSession';
const REFRESH_SECRET = 'SecretForRefresh';

function generateAccessToken(userId) {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '1m' });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ message: 'Пользователь уже существует' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await db.query('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, password_hash]);

    res.status(201).json({ message: 'Пользователь зарегистрирован' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Неверная почта или пароль' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Неверная почта или пароль' });
    }

    //const payload = {userId: user.id};
    //const token = jwt.sign(payload, SECRET, { expiresIn: '5m' });
    //res.status(200).json({ message: 'Успешный вход', token: token});
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      //secure: true, // только на HTTPS
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


router.post('/refresh', (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'Нет refresh токена' });

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.userId);
    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: 'Неверный refresh токен' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Вы вышли из системы' });
});

module.exports = router;