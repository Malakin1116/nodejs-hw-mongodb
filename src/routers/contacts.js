import { Router } from 'express';

import * as contactController from '../controllers/contacts.js';

const contactRouter = Router();

contactRouter.get('/', contactController.getContactsController);

contactRouter.get('/:id', contactController.getContactsByIdController);

export default contactRouter;
