const shouldCheckCsrf = (method) => ["POST", "PUT", "PATCH", "DELETE"].includes(method);

const enforceSameOrigin = (req, res, next) => {
  if (!shouldCheckCsrf(req.method)) {
    return next();
  }

  const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  const isOriginValid = origin === allowedOrigin;
  const isRefererValid = referer.startsWith(allowedOrigin);

  if (!isOriginValid && !isRefererValid) {
    return res.status(403).json({ message: "CSRF validation failed." });
  }

  return next();
};

module.exports = { enforceSameOrigin };
