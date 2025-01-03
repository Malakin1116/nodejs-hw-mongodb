export const handleSaveError = (error, doc, next) => {
  error.status = 400;
  next();
};
