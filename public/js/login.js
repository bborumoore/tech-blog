const loginFormHandler = async function(event) {
  event.preventDefault();

  const usernameEl = document.querySelector('#username-input-login');
  const passwordEl = document.querySelector('#password-input-login');
  const nextPathEl = document.querySelector('#next-path');
  const username = usernameEl.value.trim();
  const password = passwordEl.value;

  if (!username || !password) {
    alert('Username and password are required.');
    return;
  }

  const response = await fetch('/api/user/login', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
    headers: window.TechBlogSecurity.withCsrfHeaders({ 'Content-Type': 'application/json' }),
  });

  if (response.ok) {
    const nextPath = nextPathEl ? nextPathEl.value : '';
    const safePath = nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')
      ? nextPath
      : '/dashboard';
    document.location.replace(safePath);
  } else {
    const responseBody = await response.json().catch(() => ({}));
    alert(responseBody.message || 'Failed to login');
  }
};

document
  .querySelector('#login-form')
  .addEventListener('submit', loginFormHandler);