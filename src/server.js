// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // <-- Добавили импорт
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js'; // <-- Добавили импорт роутера авторизации

dotenv.config();

export const setupServer = async () => {
  const app = express();

  try {
    // 1. Подключение к БД перед запуском сервера
    await connectMongoDB();

    // 2. Подключение стандартных middleware
    app.use(cors({
      origin: true, // Позволяет корректно работать кросс-доменным кукам
      credentials: true // Обязательно для передачи кук между фронтендом и бэкендом
    }));
    app.use(express.json());
    app.use(cookieParser()); // <-- Обязательно подключаем перед роутами!
    app.use(logger);

    // 3. Регистрация маршрутов
    app.use('/auth', authRouter); // <-- Подключаем роуты авторизации с префиксом /auth
    app.use(notesRouter);

    // 4. Обработка несуществующих маршрутов (404)
    app.use(notFoundHandler);

    // 5. ОБРАБОТКА ОШИБОК ВАЛИДАЦИИ CELEBRATE
    app.use(errors());

    // 6. Глобальный обработчик ошибок (500)
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
