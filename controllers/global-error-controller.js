/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const AppError = require("../utils/app-error");

const handleCastError = err => {
  const message = `Only accepeted data type for ${err.path} is ${err.kind}`;
  return new AppError(message, 400);
};

const handleValidationError = err => {
  const errorsSet = new Set(
    Object.keys(err.errors).map(e => {
      const error = err.errors[e];
      if (error.name === "ValidatorError") return error.message;
      if (error.name === "CastError")
        return `Data type for ${error.path} can only be ${error.kind}`;
    })
  );

  const message = [...errorsSet].filter(m => m).join(". ");
  return new AppError(message, 400);
};

const handle11000Error = err => {
  const duplicateKey = Object.keys(err.keyValue)[0];
  const message = `There's already an existing ${duplicateKey} with the given value`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError("Your log in token is invalid", 401);

const handleJWTExpiredError = () =>
  new AppError("Your log in token has expired", 401);

const renderError = (res, err, customMsg) =>
  res.status(err.statusCode).render("pages/error", {
    title: "Error",
    message: customMsg || err.message,
  });

const sendDevError = (err, req, res) => {
  if (req.originalUrl.startsWith("/api"))
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  else renderError(res, err);
};

const sendProdError = (err, req, res) => {
  if (err.fromApp)
    if (req.originalUrl.startsWith("/api"))
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    else renderError(res, err);
  else if (req.originalUrl.startsWith("/api"))
    res.status(err.statusCode).json({
      status: err.status,
      message: "Something went wrong, try again later",
    });
  else renderError(res, err, "Something went wrong, try again later");
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.error(err);

  if (process.env.NODE_ENV === "development")
    return sendDevError(err, req, res);

  let errCopy = JSON.parse(JSON.stringify(err));
  if (err.name === "CastError") errCopy = handleCastError(err);
  if (err.name === "ValidationError") errCopy = handleValidationError(err);
  if (err.code === 11000) errCopy = handle11000Error(err);
  if (err.name === "JsonWebTokenError") errCopy = handleJWTError();
  if (err.name === "TokenExpiredError") errCopy = handleJWTExpiredError();

  sendProdError(errCopy, req, res);
};
