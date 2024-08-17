import { useQuery } from 'react-query';
import axios from 'axios';
import { List, Card, Typography, Spin, Alert, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const fetchFlaggedContent = async () => {
    const { data } = await axios.get('/api/moderation');
    return data;
};

export default function Moderation() {
    const { data: flaggedPosts, isLoading, error } = useQuery('moderation', fetchFlaggedContent);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
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
            <Title level={2} className="text-center mb-6">Moderation Dashboard</Title>
            <List
                dataSource={flaggedPosts}
                renderItem={post => (
                    <List.Item
                        key={post.id}
                        className="bg-white rounded-lg shadow-md p-4 mb-4"
                        actions={[
                            <Button key="review" type="link" icon={<ExclamationCircleOutlined />} danger>
                                Review
                            </Button>,
                            <Button key="delete" type="primary" danger>
                                Delete
                            </Button>,
                        ]}
                    >
                        <List.Item.Meta
                            title={
                                <a href={`/posts/${post.id}`} className="text-lg font-semibold">
                                    {post.title}
                                </a>
                            }
                            description={`Flags: ${post.flags}`}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
}
