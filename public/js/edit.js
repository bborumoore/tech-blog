const postId = document.querySelector('input[name="post-id"]').value;

const editFormHandler = async function(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value.trim();
  const body = document.querySelector('textarea[name="post-body"]').value.trim();
  if (!title || !body) {
    alert('A title and post body are required.');
    return;
  }

  const response = await fetch(`/api/post/${postId}`, {
    method: 'PUT',
    body: JSON.stringify({
      title,
      body
    }),
    headers: {
      ...window.TechBlogSecurity.withCsrfHeaders(),
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.location.replace('/dashboard');
    return;
  }

  const responseBody = await response.json().catch(() => ({}));
  alert(responseBody.message || 'Unable to update post.');
};

const deleteClickHandler = async function() {
  const response = await fetch(`/api/post/${postId}`, {
    method: 'DELETE',
    headers: window.TechBlogSecurity.withCsrfHeaders(),
  });

  if (response.ok) {
    document.location.replace('/dashboard');
    return;
  }

  const responseBody = await response.json().catch(() => ({}));
  alert(responseBody.message || 'Unable to delete post.');
};

document
  .querySelector('#edit-post-form')
  .addEventListener('submit', editFormHandler);
document
  .querySelector('#delete-btn')
  .addEventListener('click', deleteClickHandler);
