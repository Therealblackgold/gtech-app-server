// imports
const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

// port variable
const PORT = process.env.PORT || 3500;

// calling connectDB function
connectDB();

// Middleware
app.use(logger);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes"));

// 404 routes
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found " });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Error middleware
app.use(errorHandler);

// Listening on port and connecting to MongoDB
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB ⭐️");
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
