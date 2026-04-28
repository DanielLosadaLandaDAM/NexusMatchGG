const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Conexión a la Base de Datos (se crea el archivo automáticamente)
const db = new sqlite3.Database('./nexusmatch.db');

// 2. Crear la tabla de jugadores
db.run(`CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT,
    game TEXT,
    rank TEXT,
    role TEXT,
    discord_tag TEXT
)`);

// 3. Ruta para OBTENER todos los jugadores (el filtro lo haremos en Vue para que sea instantáneo)
app.get('/api/players', (req, res) => {
    db.all("SELECT * FROM players", [], (err, rows) => {
        if (err) res.status(400).json({"error":err.message});
        res.json(rows);
    });
});

// 4. Ruta para REGISTRAR un nuevo jugador
app.post('/api/players', (req, res) => {
    const { nickname, game, rank, role, discord_tag } = req.body;
    db.run(`INSERT INTO players (nickname, game, rank, role, discord_tag) VALUES (?, ?, ?, ?, ?)`,
        [nickname, game, rank, role, discord_tag],
        function(err) {
            if (err) res.status(400).json({"error":err.message});
            res.json({"id": this.lastID});
        }
    );
});

app.listen(3000, () => console.log('Servidor NexusMatch corriendo en http://localhost:3000'));