const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Page d'accueil simple
app.get("/", (req, res) => {
  res.send("✅ Serveur actif ! Utilise /getAvatarValue?userId=123456");
});

// ✅ Route principale
app.get("/getAvatarValue", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "No userId provided" });
  }

  try {
    // 🔍 Récupère les assets de l'avatar
    const avatarRes = await axios.get(`https://avatar.roblox.com/v1/users/${userId}/avatar`);
    const assets = avatarRes.data.assets || [];

    let totalValue = 0;

    // 🧮 Pour chaque asset, on va chercher le prix réel
    for (const asset of assets) {
      try {
        const resale = await axios.get(`https://economy.roblox.com/v1/assets/${asset.id}/resale-data`);
        const price = resale.data?.originalPrice || 0;
        totalValue += price;
      } catch (err) {
        // 📉 Si pas de prix dispo, on ignore l'erreur
        totalValue += 0;
      }
    }

    res.json({ total: totalValue });

  } catch (error) {
    console.error("Erreur serveur:", error.message);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// ✅ Démarre le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});

