import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    // 1. Проверяем наличие файла в реквесте по ТЗ
    if (!req.file) {
      throw createHttpError(400, 'No file');
    }

    // ID авторизованного пользователя берем из req.user (его добавляет middleware authenticate)
    const userId = req.user._id;

    // 2. Загружаем файл из буфера памяти в Cloudinary
    const cloudinaryResponse = await saveFileToCloudinary(req.file.buffer, userId);

    // 3. Обновляем поле avatar в базе данных, используя новый синтаксис для автотеста
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: cloudinaryResponse.secure_url },
      { returnDocument: 'after' } // <-- ИСПРАВИЛИ: заменили { new: true } на современную опцию по требованию GoIT
    );

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    // 4. Возвращаем успешный ответ со ссылкой на аватар по ТЗ
    res.status(200).json({
      url: updatedUser.avatar,
    });
  } catch (error) {
    next(error);
  }
};
