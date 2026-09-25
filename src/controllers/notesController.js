import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// 1. GET /notes — Отримувати лише нотатки, що належать поточному користувачу
// Полностью заменяем только метод getAllNotes:

export const getAllNotes = async (req, res, next) => {
  try {
    const { tag, search, page, perPage } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedPerPage = parseInt(perPage, 10);
    const skip = (parsedPage - 1) * parsedPerPage;

    // 1. Инициализируем базовый запрос Mongoose, фильтруя только по userId владельца
    const notesQuery = Note.find().where('userId').equals(req.user._id);
    const countQuery = Note.countDocuments().where('userId').equals(req.user._id);

    // 2. Динамически добавляем фильтр по тегу через .where().equals()
    if (tag) {
      notesQuery.where('tag').equals(tag);
      countQuery.where('tag').equals(tag);
    }

    // 3. Динамически добавляем поиск через оператор $or в метод .where()
    if (search) {
      const searchFilter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      };
      notesQuery.where(searchFilter);
      countQuery.where(searchFilter);
    }

    // 4. Добавляем пагинацию к основному запросу
    notesQuery.skip(skip).limit(parsedPerPage);

    // Выполняем запросы параллельно
    const [notes, totalNotes] = await Promise.all([notesQuery, countQuery]);

    const totalPages = Math.ceil(totalNotes / parsedPerPage);

    res.status(200).json({
      page: parsedPage,
      perPage: parsedPerPage,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET /notes/:noteId — Шукаємо нотатку за _id, яка належить поточному користувачу
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    // Метод findById не підійде, шукаємо через findOne з перевіркою власника
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// 3. POST /notes — При створенні додаємо userId з req.user._id
export const createNote = async (req, res, next) => {
  try {
    const newNote = await Note.create({
      ...req.body,
      userId: req.user._id, // Прив'язуємо нотатку до поточного користувача
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

// 4. DELETE /notes/:noteId — Видаляти можна лише нотатку, яка належить поточному користувачу
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    // Використовуємо findOneAndDelete замість findByIdAndDelete
    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });

    if (!deletedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(deletedNote);
  } catch (error) {
    next(error);
  }
};

// 5. PATCH /notes/:noteId — Оновлювати можна лише нотатку, яка належить поточному користувачу
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    // Використовуємо findOneAndUpdate замість findByIdAndUpdate
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user._id },
      req.body,
      { returnDocument: 'after' }
    );

    if (!updatedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};
