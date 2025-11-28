function notFound(req, res, next) {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? '🙈' : err.stack
  });
}

module.exports = { notFound, errorHandler };
