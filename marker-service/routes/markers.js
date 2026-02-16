module.exports = (channel) => {
  const express = require('express');
  const router = express.Router();
  const { sequelize,Marker } = require("../models")
  const { Op } = require('sequelize');

  router.post('/filter', async (req, res) => {
    let { categories } = req.body;
    console.log(categories);
    if (!categories) {
      return res.json([]);
    }

    if (!Array.isArray(categories)) {
      categories = [categories];
    }

    try {
      const rows = await Marker.findAll({
        where: sequelize.where(
          sequelize.fn(
            'JSON_UNQUOTE',
            sequelize.fn(
              'JSON_EXTRACT', 
              sequelize.col('info'), 
              sequelize.literal("'$.data.general.category.sysName'")
            )
          ),
          { [Op.in]: categories }
        )
      });

        res.json(rows);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "markers not found" });
    }
  });

  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    //console.log(`Получение информации о метке с ID: ${id}`);
    const data = await Marker.findOne({where: {id: id}});

    try {
      
      //console.log('Результат запроса:', data);
      
      if (data) {
        return res.json(data);
      } else {
        //console.log('Метка не найдена с ID:', id);
        return res.status(404).json({ message: 'Метка не найдена' });
      }
    } catch (error) {
      //console.error('Ошибка при запросе в БД:', error);
      return res.status(500).json({ error: 'Ошибка при запросе данных.' });
    }
  });

  return router;
}