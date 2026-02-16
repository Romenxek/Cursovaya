module.exports = (channel) => {
  const jwt = require('jsonwebtoken');
  const express = require('express');
  const { UserSavedMarkers, UserSavedRoutes } = require("../models")

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

    console.log(req.body);
    const { markerId }= req.body;
    if (!markerId) {
      return res.status(400).json({ message: 'Некорректные данные' });
    }

    console.log(userId,markerId);
    try {
      const existing = await UserSavedMarkers.findOne({where: {user_id: userId, marker_id: markerId}});

      if (existing) {
        return res.status(409).json({ message: 'Метка уже сохранена' });
      }

      await UserSavedMarkers.create({user_id: userId, marker_id: markerId});

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
      userId = decoded.userId;
    } catch {
      return res.status(401).json({ message: 'Неверный токен' });
    }
    console.log(`Получение меток для пользователя с ID ${userId}`);

    const saved = await UserSavedMarkers.findAll({where: {user_id: userId}});

    res.json(saved);
  });

  // Удаление сохраненной метки у пользователя
  router.post('/markers/delete', async (req, res)=>{
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
      await UserSavedMarkers.destroy({where:{user_id: userId, marker_id: markerId}})
      res.json({ message: 'Метка успешно удалена' });
    } catch (error) {
      console.error('Ошибка при удалении метки:', error);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
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

    res.json(saved);
  });

  // Удаление сохраненного маршрутв у пользователя
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