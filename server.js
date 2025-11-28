const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// === CREATE PLAYLIST ===
app.post("/api/playlists", (req, res) => {
  const { name, description, songs } = req.body;

  // Lire la base
  const filePath = "./data/playlists.json";
  const playlists = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Nouvelle playlist
  const newPlaylist = {
    id: Date.now(),
    name,
    description,
    songs: songs || []
  };

  // Sauvegarde
  playlists.push(newPlaylist);
  fs.writeFileSync(filePath, JSON.stringify(playlists, null, 2));

  res.status(201).json({ message: "Playlist créée avec succès", playlist: newPlaylist });
});

// Lancer serveur
app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
