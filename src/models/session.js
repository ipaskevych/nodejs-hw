// src/models/session.js
import { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
  {
    // Находим поле userId и меняем ref на 'User' с большой буквы:
userId: {
  type: Schema.Types.ObjectId,
  ref: 'User', // <-- ИСПРАВИЛИ
  required: true,
},
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Session = model('session', sessionSchema);
