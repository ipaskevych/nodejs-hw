import { Joi, Segments } from 'celebrate';
import { mongoose } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомная валидация для проверки MongoDB ObjectId
// Если ID невалидный, Joi вернет ошибку с кастомным сообщением
const customObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('Invalid noteId format. Must be a valid MongoDB ObjectId');
  }
  return value;
};

// 1. Схема для маршрута GET /notes (параметры строки запроса)
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS).optional(),
    search: Joi.string().allow('').optional(),
  }),
};

// 2. Схема для валидации noteId в URL параметрах (GET /notes/:noteId, DELETE /notes/:noteId)
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    noteId: Joi.string().custom(customObjectId).required(),
  }),
};

// 3. Схема для маршрута POST /notes (валидация тела запроса)
export const createNoteSchema = {
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string().valid(...TAGS).optional(),
  }),
};

// 4. Схема для маршрута PATCH /notes/:noteId (объединяем проверку params и body)
// Метод .or('title', 'content', 'tag') требует, чтобы хотя бы одно из этих полей присутствовало
export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    noteId: Joi.string().custom(customObjectId).required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(1).optional(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string().valid(...TAGS).optional(),
  }).or('title', 'content', 'tag'), // ТЕЛО НЕ ДОЛЖНО БЫТЬ ПУСТЫМ: хотя бы одно поле нужно передать
};
