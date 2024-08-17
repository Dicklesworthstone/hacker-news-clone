'use client';

import { Card, Typography, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function NotificationCard({ notification }) {
    return (
        <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow">
            <Badge dot={!notification.read}>
                <Title level={5} className="mb-0">
                    <BellOutlined className="mr-2" />
                    {notification.title}
                </Title>
            </Badge>
            <Text>{notification.message}</Text>
            <Text type="secondary" className="block mt-2">{new Date(notification.createdAt).toLocaleString()}</Text>
        </Card>
    );
}
