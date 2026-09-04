import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

export const setupServer = () => {
  const app = express();

  // 1. Стандартные Middleware
  app.use(cors());
  app.use(express.json());

  // 2. Логирование HTTP-запросов
  app.use(pino());

  // 3. Реализация маршрутов
  // GET /notes
  app.get('/notes', (req, res) => {
    res.status(200).json({
      message: 'Retrieved all notes',
    });
  });

  // GET /notes/:noteId
  app.get('/notes/:noteId', (req, res) => {
    const id_param = req.params.noteId;
    res.status(200).json({
      message: `Retrieved note with ID: ${id_param}`,
    });
  });

  // GET /test-error (Тестовый маршрут для имитации ошибки)
  app.get('/test-error', () => {
    throw new Error('Simulated server error');
  });

  // 4. Middleware для обработки несуществующих маршрутов (404)
  app.use((req, res) => {
    res.status(404).json({
      message: 'Route not found',
    });
  });

  // 5. Middleware для обработки ошибок (500)
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: err.message || 'Internal Server Error',
    });
  });

  // Запуск прослушивания порта
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
setupServer();
