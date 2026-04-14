const commentFormHandler = async function(event) {
    event.preventDefault();
  
    const postId = document.querySelector('input[name="post-id"]').value;
    const body = document.querySelector('textarea[name="comment-body"]').value;
  
    if (body) {
      const response = await fetch('/api/comment', {
        method: 'POST',
        body: JSON.stringify({
          postId,
          body
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        document.location.reload();
      } else {
        const errorPayload = await response.json().catch(() => ({}));
        alert(errorPayload.message || 'Failed to submit comment.');
      }
    } else {
      alert('Comment body is required.');
    }
  };
  
  document
    .querySelector('#new-comment-form')
    .addEventListener('submit', commentFormHandler);
  