const { code: errorCode } = require("../errorCode");
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case errorCode.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case errorCode.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
    case errorCode.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
    case errorCode.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
    case errorCode.SERVER_ERROR:
      res.json({
        title: "Server error",
        message: err.message,
        stackTrace: err.stack,
      });
    default:
      console.log("No error");
      break;
  }
};

module.exports = errorHandler;
