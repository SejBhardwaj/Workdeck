const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const database = require('./db/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Import routes
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DataTasker API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await database.initialize();
    console.log('Database initialized successfully');

    // Start server
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('DataTasker Backend API');
      console.log('='.repeat(50));
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Server running on: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await database.close();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
