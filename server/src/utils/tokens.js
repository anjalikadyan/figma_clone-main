const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing in environment variables.");
  }

  return jwtSecret;
};

const createAccessToken = (id, role) =>
  jwt.sign({ id, role }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });

const createRefreshToken = (id) =>
  jwt.sign({ id, type: "refresh" }, getJwtSecret(), {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  });

const verifyToken = (token) => jwt.verify(token, getJwtSecret());

const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge,
});

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000));
  res.cookie("refreshToken", refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyToken,
  setAuthCookies,
  clearAuthCookies,
};
