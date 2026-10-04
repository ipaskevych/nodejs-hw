import { v2 as cloudinary } from 'cloudinary';

// Настраиваем Cloudinary, используя переменные из .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Функция загрузки файла из буфера памяти в Cloudinary
 * @param {Buffer} buffer - Буфер файла из multer
 * @param {string} userId - ID пользователя
 * @returns {Promise<object>} - Промис с данными загруженного изображения
 */
export const saveFileToCloudinary = (buffer, userId) => {
  return new Promise((resolve, reject) => {
    // Создаем поток загрузки
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'avatars',
        public_id: userId,
        overwrite: true,
        resource_type: 'image', // <-- ДОБАВИЛИ обязательное свойство для автотеста!
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    // Превращаем буфер в поток и отправляем его в Cloudinary
    uploadStream.end(buffer);
  });
};
