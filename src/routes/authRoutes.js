// src/routes/authRoutes.js
import { Router } from 'express';
import { registerUserSchema, loginUserSchema } from '../validations/authValidation.js';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/authController.js';

const router = Router();

// Маршрут регистрации (с валидацией тела запроса)
router.post('/register', registerUserSchema, registerUser);

// Маршрут логина (с валидацией тела запроса)
router.post('/login', loginUserSchema, loginUser);

// Маршрут обновления сессии (данные берутся из кук)
router.post('/refresh', refreshUserSession);

// Маршрут логаута (данные берутся из кук)
router.post('/logout', logoutUser);

export default router;
