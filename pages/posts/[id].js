'use client';

import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Avatar, Card, List, Spin, Typography, Alert } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import Comment from '../../components/Comment';  // Make sure this file also has 'use client'

const { Title, Text, Paragraph } = Typography;

const fetchPostById = async (id) => {
    const { data } = await axios.get(`/api/posts/${id}`);
    return data;
};

export default function Post() {
    const router = useRouter();
    const { id } = router.query;

    const { data: post, isLoading, error } = useQuery(['post', id], () => fetchPostById(id));

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Alert message="An error occurred" description={error.message} type="error" showIcon />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Card className="mb-6 shadow-lg">
                <Title level={2} className="text-center mb-4">{post.title}</Title>
                <div className="flex items-center justify-center mb-4">
                    <Avatar icon={<UserOutlined />} className="mr-2" />
                    <Text className="text-gray-600">By {post.author.username}</Text>
                </div>
                <Paragraph className="text-lg leading-relaxed mb-4">{post.content}</Paragraph>
            </Card>
            <Card className="shadow-lg">
                <Title level={4} className="mb-4">
                    {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                </Title>
                <List
                    itemLayout="horizontal"
                    dataSource={post.comments}
                    renderItem={comment => (
                        <Comment key={comment.id} comment={comment}>
                            {comment.children && comment.children.map(childComment => (
                                <Comment key={childComment.id} comment={childComment} />
                            ))}
                        </Comment>
                    )}
                />
            </Card>
        </div>
    );
}
