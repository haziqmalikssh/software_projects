require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const notesRoutes = require('./routes/notes');
const tasksRoutes = require('./routes/tasks');
const coursesRoutes = require('./routes/courses');

// ADD THIS DEBUGGING CODE:
console.log('authRoutes:', typeof authRoutes, authRoutes);
console.log('profileRoutes:', typeof profileRoutes, profileRoutes);
console.log('notesRoutes:', typeof notesRoutes, notesRoutes);
console.log('tasksRoutes:', typeof tasksRoutes, tasksRoutes);
console.log('coursesRoutes:', typeof coursesRoutes, coursesRoutes);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Student Manager API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/courses', coursesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});