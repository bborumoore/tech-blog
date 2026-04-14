const logout = async function() {
  const response = await fetch('/api/user/logout', {
    method: 'POST',
    headers: window.TechBlogSecurity.withCsrfHeaders({ 'Content-Type': 'application/json' }),
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert('Failed to log out');
  }
};

const logoutLink = document.querySelector('#logout-link');
if (logoutLink) {
  logoutLink.addEventListener('click', logout);
}