const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  // getting username and password from req.body
  const { username, password } = req.body;

  // verifying fields are completed
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required " });
  }

  // getting user
  const foundUser = await User.findOne({ username }).exec();

  // verifying if user exists or active
  if (!foundUser || !foundUser.active) {
    return res.status(400).json({ message: "Unauthorized " });
  }

  // matching req.body password with existing user password
  const match = await bcrypt.compare(password, foundUser.password);
  // handling !match password
  if (!match) return res.status(401).json({ message: "Unauthorized " });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // create httpOnly cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //access only by a web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 100, //cookie expiry: set to match rT
  });

  // Sending accessToken containing username and roles
  res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  // if no cookie
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized " });

  const refreshToken = cookies.jwt;

  // verifying cookie using REFRESH_TOKEN_SECRET in .env file
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden " });

      // finding user by username
      const foundUser = await User.findOne({ username: decoded.username });

      // if no user is found
      if (!foundUser) return res.status(401).json({ message: "Unauthorized " });

      // signing token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      // sending accessToken
      res.json({ accessToken });
    })
  );
});

// @desc Logout
// @route POST /auth/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  // its important to pass all the options used when creating the cookie
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  // send response
  res.json({ message: "Cookie cleared" });
});

module.exports = {
  login,
  refresh,
  logout,
};
