const signupFormHandler = async function(event) {
  event.preventDefault();

  const usernameEl = document.querySelector('#username-input-signup');
  const passwordEl = document.querySelector('#password-input-signup');
  const username = usernameEl.value.trim();
  const password = passwordEl.value;

  if (!username || password.length < 8) {
    alert('Username and password (minimum 8 characters) are required.');
    return;
  }

  const response = await fetch('/api/user', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
    headers: window.TechBlogSecurity.withCsrfHeaders({ 'Content-Type': 'application/json' }),
  });

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    const responseBody = await response.json().catch(() => ({}));
    alert(responseBody.message || 'Failed to sign up');
  }
};

document
  .querySelector('#signup-form')
  .addEventListener('submit', signupFormHandler);