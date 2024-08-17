import { Card, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function UserProfile({ user }) {
    return (
        <Card className="shadow-lg mb-6">
            <div className="flex items-center">
                <Avatar size={64} icon={<UserOutlined />} className="mr-4" />
                <div>
                    <Title level={3} className="mb-0">{user.username}</Title>
                    <Text className="text-gray-600">Karma: {user.karma}</Text>
                </div>
            </div>
        </Card>
    );
}
