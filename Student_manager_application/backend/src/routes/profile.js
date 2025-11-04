const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// All profile routes require authentication
router.use(authMiddleware);

// Get user profile
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Create or update profile
router.post('/', async (req, res) => {
  try {
    const {
      name,
      student_id,
      major,
      year,
      gpa,
      phone,
      address,
      bio,
      profile_photo_url
    } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (year && (year < 1 || year > 4)) {
      return res.status(400).json({ error: 'Year must be between 1 and 4' });
    }

    if (gpa && (gpa < 0 || gpa > 4.0)) {
      return res.status(400).json({ error: 'GPA must be between 0 and 4.0' });
    }

    // Check if profile exists
    const existingProfile = await db.query(
      'SELECT id FROM profiles WHERE user_id = $1',
      [req.user.id]
    );

    let result;
    if (existingProfile.rows.length > 0) {
      // Update existing profile
      result = await db.query(
        `UPDATE profiles SET 
          name = $1, student_id = $2, major = $3, year = $4, 
          gpa = $5, phone = $6, address = $7, bio = $8, profile_photo_url = $9
         WHERE user_id = $10 
         RETURNING *`,
        [name, student_id, major, year, gpa, phone, address, bio, profile_photo_url, req.user.id]
      );
    } else {
      // Create new profile
      result = await db.query(
        `INSERT INTO profiles 
         (user_id, name, student_id, major, year, gpa, phone, address, bio, profile_photo_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
         RETURNING *`,
        [req.user.id, name, student_id, major, year, gpa, phone, address, bio, profile_photo_url]
      );
    }

    res.json({
      message: 'Profile saved successfully',
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Delete profile
router.delete('/', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM profiles WHERE user_id = $1 RETURNING id',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

module.exports = router;