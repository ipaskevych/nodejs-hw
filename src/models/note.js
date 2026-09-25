import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

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
      enum: TAGS,
      default: 'Todo',
      index: true,
    },
    userId: { // <-- Добавили поле связи с пользователем
      type: Schema.Types.ObjectId,
      ref: 'user', // Должно совпадать с именем модели в User (у нас это 'user')
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Note = model('Note', noteSchema);
