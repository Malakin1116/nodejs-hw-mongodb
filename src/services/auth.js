import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import handlebars from 'handlebars';
import path from 'node:path';
// import { readFile } from 'node:fs/promises';
import fs from 'node:fs/promises';

import { UsersCollection } from '../db/models/user.js';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import { TEMPLATES_DIR } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';
import { sendEmail } from '../utils/sendMail.js';
// import { sendEmail } from '../utils/sendMail.js';
// import { SMTP } from '../constants/index.js';
// import { error } from 'node:console';

// const emailTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');
// const emailTomplateSource = await readFile(emailTemplatePath, 'utf-8');

const jwtSecret = getEnvVar('JWT_SECRET');

const createSession = (userId) => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return {
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }

  if (!user.verify) {
    throw createHttpError(401, 'Email not verfied');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
  await SessionsCollection.deleteOne({ userId: user._id });
  const newSession = createSession(user._id);
  return await SessionsCollection.create(newSession);
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const oldSession = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }
  const isSessionTokenExpired =
    new Date() > new Date(oldSession.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  const newSession = createSession(oldSession.userId);
  return await SessionsCollection.create(newSession);
};

export const getSession = (filter) => SessionsCollection.findOne(filter);
export const getUser = (filter) => UsersCollection.findOne(filter);

export const verify = async (token) => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    const user = await UsersCollection.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'User not found');
    }
    await UsersCollection.findByIdAndUpdate(
      { _id: user._id },
      { verify: true },
    );
  } catch (err) {
    throw createHttpError(401, err.message);
  }
};

// const { email } = payload;
// const template = Handlebars.compile(emailTomplateSource);
// const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });
// const html = template({
//   link: `${appDomain}/auth/verify?token=${token}`,
// });
// const varifyEmail = {
//   from: `"Your App Name" <${getEnvVar(SMTP.SMTP_FROM)}>`,
//   to: email,
//   subject: 'Verify email',
//   html,
// };
// sendEmail(varifyEmail);

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    { sub: user._id, email },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '5m' },
  );
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const appDomain = getEnvVar('APP_DOMAIN');

  const html = template({
    name: user.name,
    link: `${appDomain}/reset-password?token=${resetToken}`,
  });

  const varifyEmail = {
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  };
  sendEmail(varifyEmail);
};

//   const resetPasswordTemplatePath = path.join(
//     TEMPLATES_DIR,
//     'reset-password-email.html',
//   );
//   const templateSource = (
//     await fs.readFile(resetPasswordTemplatePath)
//   ).toString();
//   const template = handlebars.compile(templateSource);
//   const html = template({
//     name: user.name,
//     link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
//   });

//   await sendEmail({
//     from: getEnvVar(SMTP.SMTP_FROM),
//     to: email,
//     subject: 'Reset your password',
//     html,
//   });
// };

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }
  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
