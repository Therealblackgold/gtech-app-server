const allowedOrigins = require("./allowedOrigins");

// This page is for cors options

const corsOptions = {
  origin: (origin, callback) => {
    // checking origins list from allowedOrigins
    // to allow apps with no origin = !origin this allows apps like postman and insomnia
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // if condition is successful
      callback(null, true);
    } else {
      // if condition is false
      callback(new Error("Not allowed by CORS"));
    }
  },
  // setting allow credentials header
  credentials: true,
  // setting response status
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
