const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all notes for user
router.get('/', async (req, res) => {
  try {
    const { search, category, course_id } = req.query;
    
    let query = `
      SELECT n.*, c.course_name, c.course_code 
      FROM notes n 
      LEFT JOIN courses c ON n.course_id = c.id 
      WHERE n.user_id = $1
    `;
    const params = [req.user.id];
    let paramIndex = 2;

    if (search) {
      query += ` AND (n.title ILIKE $${paramIndex} OR n.content ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      query += ` AND n.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (course_id) {
      query += ` AND n.course_id = $${paramIndex}`;
      params.push(course_id);
      paramIndex++;
    }

    query += ' ORDER BY n.created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Get single note
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT n.*, c.course_name, c.course_code 
       FROM notes n 
       LEFT JOIN courses c ON n.course_id = c.id 
       WHERE n.id = $1 AND n.user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Create new note
router.post('/', async (req, res) => {
  try {
    const { title, content, tags, category, course_id, is_favorite } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await db.query(
      `INSERT INTO notes (user_id, title, content, tags, category, course_id, is_favorite) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [req.user.id, title, content, tags, category, course_id, is_favorite || false]
    );

    res.status(201).json({
      message: 'Note created successfully',
      note: result.rows[0]
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update note
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags, category, course_id, is_favorite } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await db.query(
      `UPDATE notes SET 
        title = $1, content = $2, tags = $3, category = $4, 
        course_id = $5, is_favorite = $6
       WHERE id = $7 AND user_id = $8 
       RETURNING *`,
      [title, content, tags, category, course_id, is_favorite, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({
      message: 'Note updated successfully',
      note: result.rows[0]
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Toggle favorite
router.patch('/:id/favorite', async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE notes SET is_favorite = NOT is_favorite 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({
      message: 'Note favorite status updated',
      note: result.rows[0]
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Failed to update favorite status' });
  }
});

module.exports = router;