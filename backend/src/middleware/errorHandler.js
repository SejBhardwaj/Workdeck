/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // SQLite constraint errors
  if (err.code === 'SQLITE_CONSTRAINT') {
    if (err.message.includes('FOREIGN KEY')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid project reference',
      });
    }
    return res.status(400).json({
      success: false,
      error: 'Database constraint violation',
    });
  }

  // SQLite errors
  if (err.code && err.code.startsWith('SQLITE_')) {
    return res.status(500).json({
      success: false,
      error: 'Database error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
