// 404 handler for unmatched routes
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
