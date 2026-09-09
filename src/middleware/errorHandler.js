import { HttpError } from 'http-errors';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Проверяем, является ли ошибка экземпляром HttpError из библиотеки http-errors
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // Для всех остальных непредвиденных ошибок (код 500)
  return res.status(500).json({
    message: 'Internal Server Error',
  });
};
