import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// 1. GET /notes — Получить все заметки (с фильтрацией, поиском и пагинацией)
export const getAllNotes = async (req, res, next) => {
  try {
    // Получаем параметры из строки запроса (query-параметры уже прошли валидацию)
    const { tag, search, page, perPage } = req.query;

    // Превращаем строки в числа для работы с MongoDB
    const parsedPage = parseInt(page, 10);
    const parsedPerPage = parseInt(perPage, 10);

    // Объект для построения фильтров
    const query = {};

    // 1. Фильтрация по тегу (если он передан)
    if (tag) {
      query.tag = tag;
    }

    // 2. Текстовый поиск по title и content через оператор $regex (если search передан и не пустой)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // 3. Высчитываем сколько документов нужно пропустить для текущей страницы
    const skip = (parsedPage - 1) * parsedPerPage;

    // Выполняем параллельно два запроса к БД: получение данных и подсчет общего количества
    const [notes, totalNotes] = await Promise.all([
      Note.find(query).skip(skip).limit(parsedPerPage),
      Note.countDocuments(query),
    ]);

    // Высчитываем общее количество страниц
    const totalPages = Math.ceil(totalNotes / parsedPerPage);

    // Отправляем ответ со статусом 200 и полной мета-информацией по ТЗ
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

// 2. GET /notes/:noteId — Получить одну заметку по ID
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
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

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
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
