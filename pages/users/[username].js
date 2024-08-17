import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Typography, Spin, Alert, List, Avatar, Card } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const fetchUserProfile = async (username) => {
    const { data } = await axios.get(`/api/users/${username}`);
    return data;
};

export default function UserProfile() {
    const router = useRouter();
    const { username } = router.query;

    const { data: user, isLoading, error } = useQuery(['userProfile', username], () => fetchUserProfile(username));

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
                <div className="flex items-center mb-4">
                    <Avatar size={64} icon={<UserOutlined />} className="mr-4" />
                    <div>
                        <Title level={3} className="mb-0">{user.username}</Title>
                        <Text className="text-gray-600">Karma: {user.karma}</Text>
                    </div>
                </div>
            </Card>
            <Card className="mb-6 shadow-lg">
                <Title level={4} className="mb-4">Posts</Title>
                <List
                    itemLayout="horizontal"
                    dataSource={user.posts}
                    renderItem={post => (
                        <List.Item key={post.id}>
                            <List.Item.Meta
                                title={<a href={`/posts/${post.id}`} className="text-lg font-semibold">{post.title}</a>}
                                description={`Upvotes: ${post.upvotes}`}
                            />
                        </List.Item>
                    )}
                />
            </Card>
            <Card className="shadow-lg">
                <Title level={4} className="mb-4">Comments</Title>
                <List
                    itemLayout="horizontal"
                    dataSource={user.comments}
                    renderItem={comment => (
                        <List.Item key={comment.id}>
                            <List.Item.Meta
                                title={
                                    <a href={`/posts/${comment.postId}#comment-${comment.id}`} className="text-lg">
                                        {comment.content}
                                    </a>
                                }
                                description={`On post: ${comment.postTitle}`}
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
}
