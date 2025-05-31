const express = require('express');
const router = express.Router();
const db = require('../db');

// Получить метки по категориям
router.post('/filter', async (req, res) => {
  const { categories } = req.body;

  if (!categories || (!categories.landmarks?.length && !categories.memorials?.length)) {
    return res.json([]);
  }

  const results = [];

  try {
    if (categories.landmarks?.length) {
      const placeholders = categories.landmarks.map(() => '?').join(',');
      const [landmarks] = await db.query(
        `SELECT id, category, map_point, 'landmarks' as source FROM landmarks WHERE category IN (${placeholders})`,
        categories.landmarks
      );
      results.push(...landmarks);
    }

    if (categories.memorials?.length) {
      const placeholders = categories.memorials.map(() => '?').join(',');
      const [memorials] = await db.query(
        `SELECT id, category, map_point, 'memorials' as source FROM memorials WHERE category IN (${placeholders})`,
        categories.memorials
      );
      results.push(...memorials);
    }

    res.json(results);
  } catch (err) {
    console.error('Ошибка при получении меток:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение информации о метке по ID
router.get('/:type/:id', async (req, res) => {
  const {type, id} = req.params;
  console.log(`Получение информации о метке с ID: ${id} из таблицы ${type}`);
  const query = `SELECT * FROM ${type} WHERE id = ?`;

  try {
    const [results] = await db.query(query, [id]);
    
    console.log('Результат запроса:', results);
    
    if (results.length > 0) {
      return res.json(results[0]);
    } else {
      console.log('Метка не найдена с ID:', id);
      return res.status(404).json({ message: 'Метка не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при запросе в БД:', error);
    return res.status(500).json({ error: 'Ошибка при запросе данных.' });
  }
});

module.exports = router;
