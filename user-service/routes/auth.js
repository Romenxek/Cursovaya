const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require("../models")

const router = express.Router();

const ACCESS_SECRET = 'SecretForSession';
const REFRESH_SECRET = 'SecretForRefresh';

// function generateAccessToken(userId) {
//   return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '1m' });
// }

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({where: {email} });
  
  if (exists) return res.status(409).json({ message: "Пользователь уже существует" });

  const password_hash = await bcrypt.hash(password, 10);

  await User.create({ email, password_hash });

  res.status(201).json({ message: "Зарегистрирован" });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Неверные данные" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Неверные данные" });

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Неверная почта или пароль' });
  }

  //const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  //const payload = {userId: user.id};
  //const token = jwt.sign(payload, SECRET, { expiresIn: '5m' });
  //res.status(200).json({ message: 'Успешный вход', token: token});

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    //secure: true, // только на HTTPS
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  //res.status(200).json({ accessToken });
  res.status(200);
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