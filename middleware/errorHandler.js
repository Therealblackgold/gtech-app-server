const { logEvents } = require("./logger");

// This handler overwrites the express error handler to create a custom error handler

const errorHandler = (err, req, res, next) => {
  // logging events passing the error name and message, request method url and headers origin for error log file
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  // logging error stack
  console.log(err.stack);

  // if theres an error status else respond with 500 server error
  const status = res.statusCode ? res.statusCode : 500;
  res.status(status);

  // error message
  res.json({ message: err.message });
};

module.exports = errorHandler;
