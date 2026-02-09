const express = require('express');
const router = express.Router();
const { Marker } = require("../models")

router.post('/filter', async (req, res) => {
  const { categories } = req.body;

  if (!categories) {
    return res.json([]);
  }

  const results = [];

  try {
      const rows = await Marker.findAll({
          where: {
              [Op.and]: [
                  sequelize.where(
                      sequelize.fn(
                          'JSON_UNQUOTE',
                          sequelize.fn('JSON_EXTRACT', sequelize.col('info'), '$.data.general.category.sysname')
                      ),
                      { [Op.in]: sysnames }
                  )
              ]
          }
      });

      res.json(rows);
  } catch (e) {
      console.log(e);
      res.status(500).json({ error: "markers not found" });
  }

//   try {
//     if (categories.landmarks?.length) {
//       const placeholders = categories.landmarks.map(() => '?').join(',');
//       const [landmarks] = await db.query(
//         `SELECT id, category, map_point, 'landmarks' as source FROM landmarks WHERE category IN (${placeholders})`,
//         categories.landmarks
//       );
//       results.push(...landmarks);
//     }

//     if (categories.memorials?.length) {
//       const placeholders = categories.memorials.map(() => '?').join(',');
//       const [memorials] = await db.query(
//         `SELECT id, category, map_point, 'memorials' as source FROM memorials WHERE category IN (${placeholders})`,
//         categories.memorials
//       );
//       results.push(...memorials);
//     }
});

// Получение информации о метке по ID
router.get('/:id', async (req, res) => {
  const id = req.params;
  console.log(`Получение информации о метке с ID: ${id}`);
  const data = Marker.findOne({where: {id}});

  try {
    
    console.log('Результат запроса:', results);
    
    if (data) { //проверить
      return res.json(data);
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
