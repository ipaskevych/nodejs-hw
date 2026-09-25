// src/middleware/authenticate.js
import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken, sessionId } = req.cookies; // <-- Добавили получение sessionId

    // Проверяем наличие обеих кук
    if (!accessToken || !sessionId) {
      throw createHttpError(401, 'Missing access token or session id');
    }

    // Ищем сессию по токену И по id сессии вместе
    const session = await Session.findOne({ _id: sessionId, accessToken });
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    // Проверяем, не просрочен ли access-токен
    const isAccessTokenExpired = new Date() > new Date(session.accessTokenValidUntil);
    if (isAccessTokenExpired) {
      throw createHttpError(401, 'Access token expired');
    }

    // Ищем пользователя, связанного с этой сессией
    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
