import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema } from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  requestResetEmailController,
} from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema } from '../validation/auth.js';

// import { requestResetEmailSchema } from '../validation/auth.js';
// import { requestResetEmailController } from '../controllers/auth.js';

// import { resetPasswordSchema } from '../validation/auth.js';
// import { resetPasswordController } from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
authRouter.post('/logout', ctrlWrapper(logoutUserController));
authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));

authRouter.get(
  '/request-reset-email',
  ctrlWrapper(requestResetEmailController),
);

// authRouter.post(
//   '/request-reset-email',
//   validateBody(requestResetEmailSchema),
//   ctrlWrapper(requestResetEmailController),
// );

// authRouter.post(
//   '/reset-password',
//   validateBody(resetPasswordSchema),
//   ctrlWrapper(resetPasswordController),
// );

export default authRouter;
