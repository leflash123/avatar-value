const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("✅ Serveur actif !");
});

app.get("/getAvatarValue", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.json({ error: "No userId provided" });

  try {
    const avatarRes = await axios.get(`https://avatar.roblox.com/v1/users/${userId}/avatar`);
    const assets = avatarRes.data.assets || [];

    let totalValue = 0;
    for (let asset of assets) {
      try {
        const catalogRes = await axios.get(`https://catalog.roblox.com/v1/catalog/items/${asset.id}`);
        const price = catalogRes.data?.price || 0;
        totalValue += price;
      } catch {
        totalValue += 0;
      }
    }

    res.json({ total: totalValue });
  } catch (e) {
    res.json({ error: "Erreur serveur" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
