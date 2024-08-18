'use client';

import { Card, Avatar, Typography, Tag as AntTag, Tooltip } from 'antd';
import { LikeOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { marked } from 'marked';

const { Title, Text } = Typography;

export default function PostCard({ post }) {
    return (
        <Card className="mb-4 shadow-lg">
            <Card.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={
                    <Link href={`/posts/${post.id}`}>
                        <Title level={4} className="text-blue-500 hover:underline">
                            {post.title}
                        </Title>
                    </Link>
                }
                description={
                    <div>
                        <Text>
                            By{' '}
                            <Link href={`/users/${post.author.username}`}>
                                <span className="font-semibold text-blue-500 hover:underline">
                                    {post.author.username}
                                </span>
                            </Link>
                        </Text>
                        <div className="mt-2">
                            <div dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
                        </div>
                        <div className="mt-2">
                            <Text className="mr-2">Category: {post.category.name}</Text>
                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-2">
                                    {post.tags.map(tag => (
                                        <AntTag key={tag.id} color="blue">
                                            {tag.name}
                                        </AntTag>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                }
            />
            <div className="mt-4 flex justify-between">
                <Tooltip title="Upvotes">
                    <div className="flex items-center">
                        <LikeOutlined className="mr-1" />
                        <Text>{post.upvotes}</Text>
                    </div>
                </Tooltip>
                {post.flags > 0 && (
                    <Tooltip title={`${post.flags} flags`}>
                        <Text type="danger">{post.flags} flags</Text>
                    </Tooltip>
                )}
            </div>
        </Card>
    );
}
