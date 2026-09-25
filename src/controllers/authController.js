// src/controllers/authController.js
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';

// 1. РЕГИСТРАЦИЯ КОРИСТУВАЧА
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Перевіряємо, чи користувач із таким email вже існує
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(400, 'Email in use');
    }

    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створюємо нового користувача в базі
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // Створюємо нову сесію та додаємо кукі до відповіді
    const session = await createSession(user._id);
    setSessionCookies(res, session);

    // Повертаємо відповідь зі статусом 201 і об’єктом користувача (без пароля завдяки toJSON)
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// 2. ЛОГІН КОРИСТУВАЧА
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Перевіряємо, чи користувач існує в базі даних
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'Invalid credentials');
    }

    // Перевіряємо чи вірний пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Invalid credentials');
    }

    // Видаляємо стару сесію цього користувача та створюємо нову
    await Session.deleteOne({ userId: user._id });
    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// 3. ОНОВЛЕННЯ СЕСІЇ
// Знаходимо refreshUserSession у src/controllers/authController.js і замінюємо її:
export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    // Шукаємо у базі даних сесію за sessionId та refreshToken з cookies
    const session = await Session.findOne({ _id: sessionId, refreshToken });
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    // Перевіряємо, чи не прострочений refresh-токен
    const isRefreshTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

    if (isRefreshTokenExpired) {
      // 1. Спочатку видаляємо застарілу сесію з бази даних
      await Session.deleteOne({ _id: sessionId });

      // 2. Очищаємо всі куки в браузері користувача
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      };
      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', cookieOptions);
      res.clearCookie('sessionId', cookieOptions);

      // 3. Лише після цього викидаємо помилку 401
      throw createHttpError(401, 'Session token expired');
    }

    // Видаляємо стару успішну сесію з бази, бо зараз створимо нову
    await Session.deleteOne({ _id: sessionId });

    // Створюємо нову сесію і додаємо нові кукі
    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({
      message: 'Session refreshed',
    });
  } catch (error) {
    next(error);
  }
};

// 4. ЛОГАУТ КОРИСТУВАЧА
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    // Якщо є в cookies sessionId — видаляємо відповідну сесію з бази даних
    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    // Очищаємо cookies
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('sessionId', cookieOptions);

    // Повертаємо відповідь зі статусом 204 (без тіла)
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
