import multer from 'multer';
import createHttpError from 'http-errors';

// 1. Настраиваем хранение файла в оперативной памяти (buffer)
const storage = multer.memoryStorage();

// 2. Функция фильтрации файлов по типу
const fileFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
  } else {
    // Если тип файла не картинка, возвращаем ошибку по ТЗ
    callback(createHttpError(400, 'Only images allowed'), false);
  }
};

// 3. Экспортируем настроенный middleware upload с лимитом размера 2MB
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB в байтах
  },
});
