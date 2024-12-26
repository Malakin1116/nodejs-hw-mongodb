import ContactCollection from '../db/models/Contact.js';

export const getContact = () => ContactCollection.find();

export const getContactById = (id) => ContactCollection.findById(id);

export const addMovie = (payload) => ContactCollection.create(payload);

export const updateContact = async (_id, payload) => {
  const result = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    new: true,
    upsert: true,
  });

  return result;
};
