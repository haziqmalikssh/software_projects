import { useEffect, useState } from 'react';
import API from '../api/api';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', due_date: '' });

  const fetchNotes = async () => {
    const res = await API.get('/notes');
    setNotes(res.data);
  };

  const addNote = async (e) => {
    e.preventDefault();
    await API.post('/notes', newNote);
    setNewNote({ title: '', content: '', due_date: '' });
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await API.delete(`/notes/${id}`);
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="p-6">
      <h1>Your Notes</h1>
      <form onSubmit={addNote}>
        <input placeholder="Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
        <input placeholder="Due Date" type="date" value={newNote.due_date} onChange={(e) => setNewNote({ ...newNote, due_date: e.target.value })} />
        <textarea placeholder="Content" value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} />
        <button type="submit">Add Note</button>
      </form>

      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            <h3>{n.title}</h3>
            <p>{n.content}</p>
            <p>Due: {n.due_date}</p>
            <button onClick={() => deleteNote(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
