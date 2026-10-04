// src/routes/authRoutes.js
import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema
} from '../validations/authValidation.js';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword,
} from '../controllers/authController.js';

const router = Router();

// Оборачиваем схемы в celebrate({ body: ... }) прямо в маршрутах
router.post('/register', celebrate({ body: registerUserSchema }), registerUser);
router.post('/login', celebrate({ body: loginUserSchema }), loginUser);
router.post('/refresh', refreshUserSession);
router.post('/logout', logoutUser);

// Новые роуты для сброса пароля по ТЗ
router.post('/request-reset-email', celebrate({ body: requestResetEmailSchema }), requestResetEmail);
router.post('/reset-password', celebrate({ body: resetPasswordSchema }), resetPassword);

export default router;
