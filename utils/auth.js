// Middleware to redirect to the login page if not logged in
const withAuth = (req, res, next) => {
  if (!req.session.userId) {
    const returnTo = encodeURIComponent(req.originalUrl || '/dashboard');
    res.redirect(`/login?next=${returnTo}`);
    return;
  }

  next();
};

module.exports = withAuth;