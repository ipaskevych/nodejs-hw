// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Поддержка статусов из библиотеки http-errors
  const status = err.status || err.statusCode || 500;

  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
};
