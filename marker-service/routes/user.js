module.exports = (channel) => {
  const jwt = require('jsonwebtoken');
  const express = require('express');
  const { Marker, UserSavedMarker, UserSavedRoutes } = require("../models")

  const router = express.Router();

  const SECRET = 'SecretForSession';

  router.post('/markers/save', async (req, res) => {
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

    const { markerId }= req.body;
    if (!markerId) {
      return res.status(400).json({ message: 'Некорректные данные' });
    }

    console.log("юзер, метка");
    console.log(userId,markerId);
    try {
      const existing = await UserSavedMarker.findOne({where: {user_id: userId, marker_id: markerId},attributes: ["marker_id"]});

      if (existing) {
        return res.status(409).json({ message: 'Метка уже сохранена' });
      }

      await UserSavedMarker.create({user_id: userId, marker_id: markerId, created_at: Date.now()});

      res.status(201).json({ message: 'Метка сохранена' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });

  router.get('/markers/load', async (req,res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Требуется авторизация' });
    const token = authHeader.split(' ')[1];
    let userId;
    try {
      const decoded = jwt.verify(token, SECRET);
      console.log(decoded);
      userId = decoded.userId;
    } catch {
      return res.status(401).json({ message: 'Неверный токен' });
    }
    console.log(`Получение меток для пользователя с ID ${userId}`);

    try {
      const saved = await UserSavedMarker.findAll({ 
        where: { user_id: userId },
        attributes: ["marker_id"],
        include: [{
          model: Marker,
          attributes: ["id", "name", "lat", "lon","info"],
        }]
      });

      res.status(201).json(saved);
    } catch (error) {
      console.log(error);
    }
  });

  router.post('/markers/delete', async (req, res) => {
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

    const { markerId } = req.body;
    if (!markerId) {
      return res.status(400).json({ message: 'Некорректные данные' });
    }

    try {
      await UserSavedMarker.destroy({where:{user_id: userId, marker_id: markerId}})
      res.json({ message: 'Метка успешно удалена' });
    } catch (error) {
      console.error('Ошибка при удалении метки:', error);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  });

  router.get('/markers/is-saved/:id', async (req, res) => {
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

    const markerId = req.params.id;

    const existing = await UserSavedMarker.findOne({
      where: { user_id: userId, marker_id: markerId },
      attributes: ['marker_id']
    });

    res.json({ saved: !!existing });
  });

  router.post('/routes/save', async (req, res) => {
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
    const { routeId }= req.body;
    if (!routeId) {
      return res.status(400).json({ message: 'Некорректные данные' });
    }

    console.log(userId,routeId);
    try {
      const existing = await UserSavedRoutes.findOne({where: {user_id: userId, route_id: routeId}});

      if (existing) {
        return res.status(409).json({ message: 'Маршрут уже сохранен' });
      }

      await UserSavedRoutes.create({user_id: userId, route_id: routeId});

      res.status(201).json({ message: 'Метка сохранена' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });

  router.get('/routes/load', async (req,res) => {
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

    const saved = await UserSavedRoutes.findAll({where: {user_id: userId}});
    console.log(saved);
    res.json(saved);
  });

  router.post('/routes/delete', async (req, res)=>{
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

    const { routeId } = req.body;
    if (!routeId) {
      return res.status(400).json({ message: 'Некорректные данные' });
    }

    try {
      await UserSavedRoutes.destroy({where:{user_id: userId, route_id: routeId}})
      res.json({ message: 'Метка успешно удалена' });
    } catch (error) {
      console.error('Ошибка при удалении метки:', error);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  });

  return router;
}