const newFormHandler = async function(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value.trim();
  const body = document.querySelector('textarea[name="post-body"]').value.trim();

  if (!title || !body) {
    alert('A title and post body are required.');
    return;
  }

  const response = await fetch('/api/post', {
    method: 'POST',
    body: JSON.stringify({
      title,
      body,
    }),
    headers: window.TechBlogSecurity.withCsrfHeaders({ 'Content-Type': 'application/json' }),
  });

  if (response.ok) {
    document.location.replace('/dashboard');
    return;
  }

  const responseBody = await response.json().catch(() => ({}));
  alert(responseBody.message || 'Unable to create post.');
};

document
  .querySelector('#new-post-form')
  .addEventListener('submit', newFormHandler);