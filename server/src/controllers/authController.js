const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const {
  createAccessToken,
  createRefreshToken,
  verifyToken,
  setAuthCookies,
  clearAuthCookies,
} = require("../utils/tokens");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getPasswordValidationError = (password = "") => {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must include one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include one number.";
  return null;
};

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const passwordValidationError = getPasswordValidationError(password);
    if (passwordValidationError) {
      return res.status(400).json({ message: passwordValidationError });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Account already exists for this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const accessToken = createAccessToken(user._id, user.role);
    const refreshToken = createRefreshToken(user._id);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      token: accessToken,
      user: toSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const accessToken = createAccessToken(user._id, user.role);
    const refreshToken = createRefreshToken(user._id);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      token: accessToken,
      user: toSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing." });
    }

    const decoded = verifyToken(refreshToken);
    if (decoded.type !== "refresh") {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const isTokenValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isTokenValid) {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const newAccessToken = createAccessToken(user._id, user.role);
    const newRefreshToken = createRefreshToken(user._id);
    user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    await user.save();

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      token: newAccessToken,
      user: toSafeUser(user),
    });
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired refresh token." });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        const decoded = verifyToken(refreshToken);
        await User.findByIdAndUpdate(decoded.id, { refreshTokenHash: null });
      } catch (_error) {
        // Ignore token parsing errors while logging out.
      }
    }

    clearAuthCookies(res);
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(200).json({
        message: "If an account exists for this email, a reset link has been prepared.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordTokenHash = resetTokenHash;
    user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      message: "Password reset token generated.",
      resetToken,
      expiresInMinutes: 60,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Reset token and new password are required." });
    }

    const passwordValidationError = getPasswordValidationError(password);
    if (passwordValidationError) {
      return res.status(400).json({ message: passwordValidationError });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpiresAt = null;
    user.refreshTokenHash = null;
    await user.save();

    clearAuthCookies(res);

    return res.status(200).json({ message: "Password reset successfully. Please sign in again." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  signin,
  getCurrentUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
};
