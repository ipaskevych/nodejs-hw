import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js'; // 1. Импортируем массив тегов

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS,       // 2. Используем импортированную константу
      default: 'Todo',
      index: true,      // 3. ДОБАВИЛИ ИНДЕКС, как требует задание!
    },
  },
  {
    timestamps: true, // Автоматически добавляет createdAt и updatedAt
    versionKey: false, // Убирает техническое поле __v
  }
);

export const Note = model('Note', noteSchema);
