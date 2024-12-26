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

  // if (!data) {
  //   return res.status(404).json({
  //     status: 404,
  //     message: `Contact ${id} not found`,
  //   });

  // }

  if (!data) {
    throw createHttpError(404);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}`,
    data,
  });
};
