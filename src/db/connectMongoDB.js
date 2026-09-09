import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      throw new Error('MONGO_URL environment variable is not defined');
    }

    // Подключаемся к MongoDB с помощью mongoose
    await mongoose.connect(mongoUrl);

    // Строгое требование из задания по выводу сообщения:
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('Error while setting up mongo connection', error);
    throw error;
  }
};
