// src/middleware/authenticate.js
import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    // 1. Проверяем наличие куки accessToken
    if (!accessToken) {
      throw createHttpError(401, 'Missing access token');
    }

    // 2. Ищем сессию в базе данных по этому токену
    const session = await Session.findOne({ accessToken });
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    // 3. Проверяем, не просрочен ли access-токен
    const isAccessTokenExpired = new Date() > new Date(session.accessTokenValidUntil);
    if (isAccessTokenExpired) {
      throw createHttpError(401, 'Access token expired');
    }

    // 4. Ищем пользователя, связанного с этой сессией
    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401);
    }

    // 5. В случае успеха сохраняем пользователя в req.user и идем дальше
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
