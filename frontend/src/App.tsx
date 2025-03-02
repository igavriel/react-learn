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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
    <div>
      <h1>Notes App</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
        <button type="submit">Add Note</button>
      </form>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.title} - {note.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
