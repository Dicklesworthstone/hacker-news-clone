'use client';

import { useQuery } from 'react-query';
import { List, Typography, Spin, Alert, Card, Button } from 'antd';
import { LikeOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title } = Typography;

const fetchPostsByCategory = async (category) => {
    const response = await fetch(`/api/posts?category=${encodeURIComponent(category)}`);
    return await response.json();
};

export default function AskHN() {
    const { data: posts, isLoading, error } = useQuery(['posts', 'Ask HN'], () => fetchPostsByCategory('Ask HN'));

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
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
            <Title level={2} className="text-center mb-6">Ask HN</Title>
            <List
                dataSource={posts}
                renderItem={post => (
                    <List.Item
                        key={post.id}
                        className="bg-white rounded-lg shadow-md p-4 mb-4"
                        actions={[
                            <Button key="upvote" type="link" icon={<LikeOutlined />}>
                                {post.upvotes}
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={
                                <a href={`/posts/${post.id}`} className="text-lg font-semibold">
                                    {post.title}
                                </a>
                            }
                            description={`By ${post.author.username}`}
                            avatar={<UserOutlined />}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
}
