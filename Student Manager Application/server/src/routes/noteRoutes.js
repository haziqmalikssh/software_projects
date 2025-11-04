import express from 'express';
import { getNotes, addNote, deleteNote } from '../controllers/noteController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', authenticate, getNotes);
router.post('/', authenticate, addNote);
router.delete('/:id', authenticate, deleteNote);

export default router;
