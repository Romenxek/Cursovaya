const express = require('express');
const router = express.Router();

const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2UyMjAyZHJhNTYiLCJhIjoiY21hemdiZ3U0MGd5czJ2cjBueXZraXdqeiJ9.dhrBJ0WzSuL-L_R8DZErKg'

router.post('/', async (req, res) => {
  const { coordinates, mode } = req.body;
  const profile = mode || 'driving';
  console.log('Получен mode:', mode);
  
  //для osrm
  //const baseUrl = `http://router.project-osrm.org/route/v1/${mode}`;

  if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
    return res.status(400).json({ error: 'Недостаточно координат' });
  }

  try {
    // Формируем строку координат lon,lat;lon,lat;...
    const coordsStr = coordinates.map(c => c.join(',')).join(';');
    
    //для osrm
    //const url = `${baseUrl}/${coordsStr}?overview=full&geometries=geojson`;
    
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordsStr}?access_token=${MAPBOX_TOKEN}&geometries=geojson&overview=full`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Ошибка при запросе к OSRM' });
    }

    const data = await response.json();

    if (!data.routes || !data.routes.length) {
      return res.status(400).json({ error: 'Маршрут не найден' });
    }

    res.json(data);
  } catch (error) {
    console.error('Ошибка запроса к mapbox:', error);
    res.status(500).json({ error: 'Ошибка запроса к mapbox' });
  }
});

module.exports = router;