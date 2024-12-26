import express from 'express';
import cors from 'cors';

import contactRouter from './routers/contacts.js';

import { getEnvVar } from './utils/getEnvVar.js';
import { logger } from './middlewares/logger.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFounderHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(logger);

  app.use('/contacts', contactRouter);

  app.use('*', notFounderHandler);
  app.use(errorHandler);

  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => console.log(`Server is running on port ${port} `));
};
