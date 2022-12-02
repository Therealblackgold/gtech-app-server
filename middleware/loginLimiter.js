const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, //1 minute
  max: 5, // Limit each IP to 5 login requests per "window" per minute
  message: {
    message:
      "Too many login attempts from this IP, please try agin after 60 seconds.",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  },
  // source code recommended headers
  standardHeaders: true, // Return rate limit info in the "RateLimit-*"
  legacyHeaders: false, // Disable the "X-RateLimit-*" headers
});

module.exports = loginLimiter;
