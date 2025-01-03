import Joi from 'joi';
import { UsersCollection } from '../db/models/user.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registerUser = async (payload) => {
  return await UsersCollection.create(payload);
};

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
