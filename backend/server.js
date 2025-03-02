// backend/server.js
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
app.use(express.json());

const dbPath = './mydatabase.db';

async function createTable() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    );
  `);

  await db.close();
}

createTable();

app.get('/notes', async (req, res) => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  const notes = await db.all('SELECT * FROM notes');
  await db.close();

  res.json(notes);
});

app.post('/notes', async (req, res) => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.run('INSERT INTO notes (title, content) VALUES (?, ?)', req.body.title, req.body.content);
  await db.close();

  res.json({ message: 'Note added successfully' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
