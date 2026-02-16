module.exports = (channel) => {
  const express = require('express');

  const router = express.Router();

  router.delete('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
      await User.destroy({
        where: { user_id: userId }
      });

      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      channel.publish(
        "user.events.exchange",
        "user.deleted",
        Buffer.from(JSON.stringify({ userId: id }))
      );

      return res.json({ message: "User deleted" });

    } catch (error) {
      console.error("Error deleting saved markers:", error);
      return res.status(500).json({ error: "Internal error" });
    }
  });

  return router;
};