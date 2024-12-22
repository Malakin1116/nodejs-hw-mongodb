// _id
// 67682363e719d8bbf01e9d75

// isFavourite
// false
// contactType
// "personal"
// createdAt
// "2024-05-08T16:12:14.954151"
// updatedAt

import { Schema, model } from 'mongoose';

const movieSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isFavourite: {
    type: Boolean,
    default: false,
    required: true,
  },
  contactType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
    required: true,
  },
});

const MovieCollection = model('movie', movieSchema);

export default MovieCollection;
