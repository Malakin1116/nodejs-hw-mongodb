import mongoose from 'mongoose';

export const initMongoDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://Bogdan:<db_password>@cluster0.vhd27.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    );
  } catch (error) {
    console.log(error);
  }
};
