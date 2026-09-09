import { Schema, model } from 'mongoose';

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
      enum: [
        'Work', 'Personal', 'Meeting', 'Shopping',
        'Ideas', 'Travel', 'Finance', 'Health',
        'Important', 'Todo'
      ],
      default: 'Todo',
      required: true,
    },
  },
  {
    timestamps: true, // Автоматически добавляет createdAt и updatedAt
    versionKey: false, // Убирает техническое поле __v
  }
);

export const Note = model('notes', noteSchema);
