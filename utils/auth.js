// Middleware to redirect to the login page if not logged in
const withAuth = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect("/login");
    } else {
      next();
    }
  };
  
  module.exports = withAuth;
  