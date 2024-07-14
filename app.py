from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

posts = [
    {'id': 1, 'title': 'First Post', 'content': 'Content of first post'},
    {'id': 2, 'title': 'Second Post', 'content': 'Content of second post'}
]

# Serve index.html as the main page
@app.route('/')
def index():
    return render_template('index.html')

# Route to fetch all posts
@app.route('/api/posts', methods=['GET'])
def get_posts():
    return jsonify(posts)

# Route to create a new post
@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    title = data.get('title')
    content = data.get('content')

    new_post_id = posts[-1]['id'] + 1 if posts else 1
    new_post = {'id': new_post_id, 'title': title, 'content': content}
    posts.append(new_post)

    return jsonify({'message': 'Post created successfully', 'post': new_post}), 201

# Route to delete a post by id
@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    global posts
    posts = [post for post in posts if post['id'] != post_id]
    return jsonify({'message': f'Post with id {post_id} deleted successfully'}), 200

# Route to serve the create post page
@app.route('/create')
def create():
    return render_template('create.html')

# Route to serve the list posts page
@app.route('/lists')
def lists():
    return render_template('lists.html')

# Route to serve the view post page
@app.route('/view/<int:post_id>')
def view_post(post_id):
    post = next((post for post in posts if post['id'] == post_id), None)
    if post is None:
        return render_template('404.html'), 404
    return render_template('view.html', post=post)

if __name__ == '__main__':
    app.run(debug=True)
