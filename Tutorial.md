## Setting Up a React Project with SQLite Database

### Step 1: Create the Project Structure

First, create a directory for your project and initialize it with `npm init`. Then, create two subdirectories: `frontend` for the React app and `backend` for the Node.js server.

```bash
mkdir myproject
cd myproject
npm init -y
mkdir frontend backend
```

### Step 2: Setup Frontend (React with TypeScript)

Navigate to the `frontend` directory and create a new React app using `create-react-app` with TypeScript:

```bash
cd frontend
npx create-react-app . --template typescript
```

### Step 3: Setup Backend (Node.js with SQLite)

Navigate to the `backend` directory and install the necessary packages:

```bash
cd ../backend
npm init -y
npm install express sqlite3
npm install --save-dev @types/sqlite3 @types/express
```

### Step 4: Implement Backend

Create a file named `server.js` in the `backend` directory and set up an Express server with SQLite:

```javascript
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
```

### Step 5: Implement Frontend

Modify the `App.tsx` file in the `frontend` directory to interact with the backend:

```tsx
// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/notes')
      .then(response => setNotes(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    axios.post('http://localhost:5000/notes', { title, content })
      .then(() => {
        setTitle('');
        setContent('');
        axios.get('http://localhost:5000/notes')
          .then(response => setNotes(response.data))
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  };

  return (
    
      Notes App
      
         setTitle(e.target.value)} placeholder="Title" />
         setContent(e.target.value)} placeholder="Content" />
        Add Note
      
      
        {notes.map(note => (
          {note.title} - {note.content}
        ))}
      
    
  );
}

export default App;
```

### Step 6: Run the Application

Start the backend server:

```bash
cd backend
node server.js
```

Start the frontend:

```bash
cd frontend
npm start
```

Your application should now be running with a React frontend and a Node.js backend using SQLite for data storage.
