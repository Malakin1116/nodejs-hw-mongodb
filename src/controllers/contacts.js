import * as ContactServices from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res, next) => {
  try {
    const data = await ContactServices.getContact();

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getContactsByIdController = async (req, res, next) => {
  const { id } = req.params;

  const data = await ContactServices.getContactById(id);

  if (!data) {
    throw createHttpError(404);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const data = await ContactServices.addMovie(req.body);
  res.status(201).json({
    status: 201,
    message: 'Succesfull add contact',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const data = await ContactServices.updateContact(id, req.body);

  res.json({
    status: 200,
    message: 'successfully update',
    data,
  });
};
