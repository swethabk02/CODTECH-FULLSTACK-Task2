document.addEventListener('DOMContentLoaded', function() {
    fetchPosts();

    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', function(event) {
            event.preventDefault();
            createPost();
        });
    }
});

function fetchPosts() {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            const postList = document.getElementById('postList');
            postList.innerHTML = '';
            posts.forEach(post => {
                const postHTML = `
                    <article class="post">
                        <h2>${post.title}</h2>
                        <p>${post.content}</p>
                        <a href="/view/${post.id}" class="btn">View</a>
                        <button onclick="deletePost(${post.id})" class="btn">Delete</button>
                    </article>
                `;
                postList.innerHTML += postHTML;
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
}

function createPost() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Post created successfully') {
            alert(data.message);
            fetchPosts();
            document.getElementById('postForm').reset();
        } else {
            alert('Failed to create post');
        }
    })
    .catch(error => console.error('Error creating post:', error));
}

function deletePost(postId) {
    fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Post deleted successfully');
            fetchPosts();
        } else {
            throw new Error('Failed to delete post');
        }
    })
    .catch(error => console.error('Error deleting post:', error));
}
