import { pool } from '../config/db.js';

export const getNotes = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY due_date', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addNote = async (req, res) => {
  const userId = req.user.id;
  const { title, content, due_date } = req.body;
  try {
    await pool.query(
      'INSERT INTO notes (user_id, title, content, due_date) VALUES ($1, $2, $3, $4)',
      [userId, title, content, due_date]
    );
    res.status(201).json({ message: 'Note added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNote = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [id, userId]);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
