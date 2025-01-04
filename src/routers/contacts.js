import { Router } from 'express';
import * as contactController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
// import { authenticate } from '../middlewares/authenticate.js';
const contactRouter = Router();

// contactRouter.use(authenticate);

contactRouter.get('/', ctrlWrapper(contactController.getContactsController));

contactRouter.get(
  '/:id',
  isValidId,
  ctrlWrapper(contactController.getContactsByIdController),
);

contactRouter.post(
  '/',
  validateBody(contactAddSchema),
  ctrlWrapper(contactController.addContactController),
);

contactRouter.put(
  '/:id',
  isValidId,
  validateBody(contactAddSchema),
  ctrlWrapper(contactController.upsertContactController),
);

contactRouter.patch(
  '/:id',
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(contactController.patchContactController),
);

contactRouter.delete(
  '/:id',
  isValidId,
  ctrlWrapper(contactController.deleteContactController),
);

export default contactRouter;
