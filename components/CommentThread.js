function Comment({ comment, comments }) {
    const childComments = comments.filter(c => c.parentId === comment.id);

    return (
        <div style={{ marginLeft: comment.parentId ? 20 : 0, borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
            <div dangerouslySetInnerHTML={{ __html: marked(comment.content) }} />
            <p>By <a href={`/users/${comment.author.username}`}>{comment.author.username}</a></p>
            <p>Upvotes: {comment.upvotes}</p>
            <a href={`/posts/${comment.postId}#comment-${comment.id}`}>Link to this comment</a>
            {childComments.length > 0 && (
                <div>
                    {childComments.map(childComment => (
                        <Comment key={childComment.id} comment={childComment} comments={comments} />
                    ))}
                </div>
            )}
        </div>
    );
}
