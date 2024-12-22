import MovieCollection from '../db/models/Movie.js';

export const getMovies = () => MovieCollection.find();

export const getMoviesById = (id) => MovieCollection.findById(id);
