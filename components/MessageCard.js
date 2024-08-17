'use client';

import { Card, Typography, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function MessageCard({ message }) {
    return (
        <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow">
            <Space direction="vertical" size="middle" className="w-full">
                <div className="flex items-center">
                    <Avatar icon={<UserOutlined />} className="mr-3" />
                    <Title level={5} className="mb-0">{message.sender}</Title>
                </div>
                <Text>{message.content}</Text>
                <Text type="secondary" className="block mt-2">{new Date(message.createdAt).toLocaleString()}</Text>
            </Space>
        </Card>
    );
}
