const appError = require("./../utils/appError");

const handleDuplicateDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `DUPLICATE field value:${value}`;
  return new appError(400, message);
};

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}:${err.value}`;
  return new appError(400, message);
};
const handleTokenJwt = (err) => new appError(4001,"invalid token please login");
const handleExpiredJwt = (err) =>
  new appError(401,"your token has expired please login again");

const sendErrorDev = (err,req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
const sendErrorProd = (err,req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res,next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateDB(error);
    if (error.name === "JsonWebTokenError") error = handleTokenJwt(error);
    if (error.name === "TokenExpiredError") error = handleExpiredJwt(error);
    sendErrorProd(error, res);
  }
};
