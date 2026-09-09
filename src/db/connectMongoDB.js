import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      throw new Error('MONGO_URL environment variable is not defined');
    }

    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('Error while setting up mongo connection', error);
    // Добавлено аварийное завершение процесса по требованию ментора:
    process.exit(1);
  }
};
