import ContactCollection from '../db/models/Contact.js';

export const getContact = () => ContactCollection.find();

export const getContactById = (id) => ContactCollection.findById(id);
