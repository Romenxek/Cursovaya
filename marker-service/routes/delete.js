module.exports = (channel) => {
    const express = require('express');
    const { Marker } = require("../models");

    const router = express.Router();

    router.delete('/marker/:markerId', async (req, res) => {
      const { markerId } = req.params;

      try {
        await Marker.destroy({ where: { id: markerId } });

        return res.json({ message: "Marker, saved markers and photos cleaned" });

      } catch (error) {
        console.error("Error deletingmarkers:", error);
        return res.status(500).json({ error: "Internal error" });
      }
    });

  return router;
}