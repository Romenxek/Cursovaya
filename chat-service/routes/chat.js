module.exports = (channel) => {
  const express = require('express');
  const router = express.Router();
  const { Friendship } = require("../models")

  router.get('/friendships/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
      const friendships = await Friendship.findAll({
        where: { user_id: userId }
      });

      return res.json(friendships);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ошибка при запросе фото.' });
    }
  });

  return router;
}