'use client';

import { Comment as AntComment, Avatar, List, Typography, Tag as AntTag, Tooltip } from 'antd';
import { LikeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import marked from 'marked';
import dayjs from 'dayjs';

const { Text } = Typography;

function Comment({ comment, comments }) {
    const childComments = comments.filter(c => c.parentId === comment.id);

    return (
        <AntComment
            actions={[
                <Tooltip key="comment-like" title="Like">
                    <span>
                        <LikeOutlined /> {comment.upvotes}
                    </span>
                </Tooltip>,
                <Tooltip key="comment-reply" title="Reply">
                    <span>
                        <MessageOutlined /> Reply
                    </span>
                </Tooltip>,
            ]}
            author={
                <Link href={`/users/${comment.author.username}`}>
                    <Text className="font-semibold text-blue-500">
                        {comment.author.username}
                    </Text>
                </Link>
            }
            avatar={
                <Avatar icon={<UserOutlined />} />
            }
            content={
                <div>
                    <div dangerouslySetInnerHTML={{ __html: marked(comment.content) }} />
                    {comment.tags && comment.tags.length > 0 && (
                        <div className="mt-2">
                            {comment.tags.map(tag => (
                                <AntTag key={tag.id} color="blue">
                                    {tag.name}
                                </AntTag>
                            ))}
                        </div>
                    )}
                </div>
            }
            datetime={
                <Tooltip title={dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{dayjs(comment.createdAt).fromNow()}</span>
                </Tooltip>
            }
        >
            {childComments.length > 0 && (
                <List
                    itemLayout="horizontal"
                    dataSource={childComments}
                    renderItem={childComment => (
                        <Comment key={childComment.id} comment={childComment} comments={comments} />
                    )}
                />
            )}
        </AntComment>
    );
}

export default function CommentThread({ comments }) {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <List
                itemLayout="vertical"
                dataSource={comments.filter(c => !c.parentId)}
                renderItem={comment => (
                    <Comment key={comment.id} comment={comment} comments={comments} />
                )}
            />
        </div>
    );
}
