import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// 1. GET /notes — Получить все заметки
export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// 2. GET /notes/:noteId — Получить одну заметку по ID
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      // Использование http-errors по ТЗ
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// 3. POST /notes — Создать новую заметку
export const createNote = async (req, res, next) => {
  try {
    const newNote = await Note.create(req.body);
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

// 4. DELETE /notes/:noteId — Удалить существующую заметку
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(deletedNote);
  } catch (error) {
    next(error);
  }
};

// 5. PATCH /notes/:noteId — Обновить существующую заметку
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    // { new: true } возвращает уже обновленный документ из базы данных
    const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, { new: true });

    if (!updatedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};
