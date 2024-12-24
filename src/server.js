import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import * as ContactServices from './services/contacts.js';

import { getEnvVar } from './utils/getEnvVar.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const data = await ContactServices.getContact();

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;

    const data = await ContactServices.getContactById(id);

    if (!data) {
      return res.status(404).json({
        states: 404,
        message: `Contact ${id} not found`,
      });
    }

    res.json({
      states: 200,
      message: `Successfully found contact with id ${id}`,
      data,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: `${req.url} Not found`,
    });
  });

  app.use((error, res, req, next) => {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  });

  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => console.log(`Server is running on port ${port} `));
};
