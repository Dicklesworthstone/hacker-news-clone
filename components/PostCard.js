function PostCard({ post }) {
    return (
        <div className="post-card">
            <h2>{post.title}</h2>
            <p>By <a href={`/users/${post.author.username}`}>{post.author.username}</a></p>
            <p>{post.content}</p>
            <p>Upvotes: {post.upvotes}</p>
        </div>
    );
}
