const crypto = require('crypto');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_SESSION_KEY = 'csrfToken';

const getRequestToken = (req) => {
  const headerToken = req.get('x-csrf-token');
  if (typeof headerToken === 'string' && headerToken.length > 0) {
    return headerToken;
  }

  if (req.body && typeof req.body._csrf === 'string' && req.body._csrf.length > 0) {
    return req.body._csrf;
  }

  return '';
};

const ensureSessionCsrfToken = (req) => {
  if (!req.session[CSRF_SESSION_KEY]) {
    req.session[CSRF_SESSION_KEY] = crypto.randomBytes(32).toString('hex');
  }
  return req.session[CSRF_SESSION_KEY];
};

const csrfProtection = (req, res, next) => {
  if (!req.session) {
    next(new Error('Session middleware must run before CSRF protection.'));
    return;
  }

  const sessionToken = ensureSessionCsrfToken(req);
  res.locals.csrfToken = sessionToken;

  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  const requestToken = getRequestToken(req);
  if (!requestToken || requestToken !== sessionToken) {
    if (req.originalUrl.startsWith('/api/')) {
      res.status(403).json({ message: 'Invalid or missing CSRF token.' });
      return;
    }

    res.status(403).send('Invalid or missing CSRF token.');
    return;
  }

  next();
};

module.exports = {
  csrfProtection,
};
