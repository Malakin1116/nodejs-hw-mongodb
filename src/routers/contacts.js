import { Router } from 'express';

import * as contactController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../utils/validateBody.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';

const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(contactController.getContactsController));

contactRouter.get(
  '/:id',
  ctrlWrapper(contactController.getContactsByIdController),
);

contactRouter.post(
  '/',
  validateBody(contactAddSchema),
  ctrlWrapper(contactController.addContactController),
);

contactRouter.put(
  '/:id',
  validateBody(contactUpdateSchema),
  ctrlWrapper(contactController.upsertContactController),
);

contactRouter.patch(
  '/:id',
  ctrlWrapper(contactController.patchContactController),
);

contactRouter.delete(
  '/:id',
  ctrlWrapper(contactController.deleteContactController),
);

export default contactRouter;
