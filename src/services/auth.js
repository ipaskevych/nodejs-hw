// src/services/auth.js
import crypto from 'node:crypto';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

// Функция создания токенов и сессии в базе данных
export const createSession = async (userId) => {
  // Удаляем старые сессии пользователя (опционально, но логично для чистоты базы)
  await Session.deleteMany({ userId });

  // Генерируем случайные безопасные строки для токенов
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  // Рассчитываем время окончания действия токенов
  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);

  // Создаем и сохраняем сессию в MongoDB
  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

// Функция добавления кук в ответ сервера
export const setSessionCookies = (res, session) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  // Устанавливаем куку для accessToken (на 15 минут)
  res.cookie('accessToken', session.accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  // Устанавливаем куку для refreshToken (на 1 день)
  res.cookie('refreshToken', session.refreshToken, {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });

  // Устанавливаем куку для sessionId (на 1 день)
  res.cookie('sessionId', session._id, {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });
};
