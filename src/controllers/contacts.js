import * as ContactServices from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const data = await ContactServices.getContact();

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { id } = req.params;

  const data = await ContactServices.getContactById(id);

  if (!data) {
    return res.status(404).json({
      status: 404,
      message: `Contact ${id} not found`,
    });
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}`,
    data,
  });
};
