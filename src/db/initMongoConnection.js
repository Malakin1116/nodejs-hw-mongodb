import mongoose from 'mongoose';

import { getEnvVar } from '../utils/getEnvVar.js';

const dbHost = getEnvVar('DB_HOST');

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(dbHost);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log(`Error connection Mongo ${error.message}`);
    throw error;
  }
};
