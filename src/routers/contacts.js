import { Router } from 'express';

import * as contactController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(contactController.getContactsController));

contactRouter.get(
  '/:id',
  ctrlWrapper(contactController.getContactsByIdController),
);

contactRouter.post('/', ctrlWrapper(contactController.addContactController));

contactRouter.put(
  '/:id',
  ctrlWrapper(contactController.upsertContactController),
);

contactRouter.patch(
  '/:id',
  ctrlWrapper(contactController.patchContactController),
);

export default contactRouter;
