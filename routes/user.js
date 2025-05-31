const jwt = require('jsonwebtoken');
const express = require('express');
const db = require('../db');

const router = express.Router();

const SECRET = 'SecretForSession';
const REFRESH_SECRET = 'SecretForRefresh';

router.post('/save', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Требуется авторизация' });

  const token = authHeader.split(' ')[1];
  let userId;
  try {
    const decoded = jwt.verify(token, SECRET);
    userId = decoded.userId;
  } catch {
    return res.status(401).json({ message: 'Неверный токен' });
  }

  console.log(req.body);
  const { markerId, markerType } = req.body;
  if (!markerId || !markerType) {
    return res.status(400).json({ message: 'Некорректные данные' });
  }

  console.log(userId,markerId,markerType);
  try {
    const [existing] = await db.query(
      'SELECT * FROM user_saved_markers WHERE user_id = ? AND marker_id = ? AND marker_type = ?',
      [userId, markerId, markerType]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Метка уже сохранена' });
    }

    await db.query(
      'INSERT INTO user_saved_markers (user_id, marker_id, marker_type) VALUES (?, ?, ?)',
      [userId, markerId, markerType]
    );

    res.status(201).json({ message: 'Метка сохранена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/load', async (req,res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Требуется авторизация' });

  const token = authHeader.split(' ')[1];
  
  let userId;
  try {
    const decoded = jwt.verify(token, SECRET);
    userId = decoded.userId;
  } catch {
    return res.status(401).json({ message: 'Неверный токен' });
  }
  console.log(`Получение меток для пользователя с ID ${userId}`);

  const [saved] = await db.query(
    'SELECT marker_id, marker_type FROM user_saved_markers WHERE user_id = ?',
    [userId]
  );

  const landmarksIds = saved
    .filter(m => m.marker_type === 'landmarks')
    .map(m => m.marker_id);

  const memorialsIds = saved
    .filter(m => m.marker_type === 'memorials')
    .map(m => m.marker_id);

  let results = [];

  if (landmarksIds.length) {
    const [landmarks] = await db.query(
      `SELECT id, name, map_point FROM landmarks WHERE id IN (${landmarksIds.map(() => '?').join(',')})`,
      landmarksIds
    );
    landmarks.forEach(l => results.push({ ...l, marker_type: 'landmarks' }));
  }

  if (memorialsIds.length) {
    const [memorials] = await db.query(
      `SELECT id, name, map_point FROM memorials WHERE id IN (${memorialsIds.map(() => '?').join(',')})`,
      memorialsIds
    );
    memorials.forEach(m => results.push({ ...m, marker_type: 'memorials' }));
  }

  res.json(results);
});

router.post('/delete', async (req, res)=>{
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Требуется авторизация' });

  const token = authHeader.split(' ')[1];
  let userId;
  try {
    const decoded = jwt.verify(token, SECRET);
    userId = decoded.userId;
  } catch {
    return res.status(401).json({ message: 'Неверный токен' });
  }

  const { id, marker_type } = req.body;
  if (!id || !marker_type) {
    return res.status(400).json({ message: 'Некорректные данные' });
  }

  try {
    const [result] = await db.query(
      'DELETE FROM user_saved_markers WHERE user_id = ? AND marker_id = ? AND marker_type = ?',
      [userId, id, marker_type]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Метка не найдена' });
    }
    res.json({ message: 'Метка успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении метки:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
})
module.exports = router;