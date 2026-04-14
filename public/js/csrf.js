window.TechBlogSecurity = window.TechBlogSecurity || {};

window.TechBlogSecurity.getCsrfToken = function() {
  const tokenElement = document.querySelector('meta[name="csrf-token"]');
  if (!tokenElement) {
    return '';
  }
  return tokenElement.getAttribute('content') || '';
};

window.TechBlogSecurity.withCsrfHeaders = function(baseHeaders = {}) {
  const token = window.TechBlogSecurity.getCsrfToken();
  if (!token) {
    return baseHeaders;
  }
  return {
    ...baseHeaders,
    'x-csrf-token': token,
  };
};
