import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';

dotenv.config();

export const setupServer = async () => {
  const app = express();

  try {
    // 1. Подключение к БД перед запуском сервера
    await connectMongoDB();

    // 2. Подключение стандартных middleware
    app.use(cors());
    app.use(express.json());
    app.use(logger); // Логгер из внешнего файла

    // 3. Регистрация маршрутов (без вынесения части пути /notes здесь!)
    app.use(notesRouter);

    // 4. Обработка несуществующих маршрутов (404)
    app.use(notFoundHandler);

    // 5. Глобальный обработчик ошибок (500)
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
};

setupServer();
