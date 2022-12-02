const express = require("express");
const router = express.Router();
const path = require("path");

// This route is for 404 routes that will return and html page to let the user know what they are looking for is not found
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
