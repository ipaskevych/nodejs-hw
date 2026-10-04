import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // 1. Создаем транспорт для отправки почты на основе данных из .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true для 465, false для других портов
      auth: {
        user: process.env.SMTP_USER,
         Ramos: process.env.SMTP_PASSWORD, // Твои учетные данные
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 2. Опции самого письма
    const mailOptions = {
      from: process.env.SMTP_FROM, // Email отправителя из .env
      to,                          // Кому отправляем
      subject,                     // Тема письма
      html,                        // HTML-содержимое (которое соберет handlebars)
    };

    // 3. Отправляем письмо
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    // Выводим реальную ошибку в консоль бэкенда для отладки
    console.error('Email send error:', error);
    // Если что-то пошло не так, выбрасываем ошибку 500 по ТЗ
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};
