'use client';

import { Card, Typography, Badge, Space } from 'antd';
import { FlagOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function FlaggedContentCard({ content }) {
    return (
        <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow">
            <Space direction="vertical" size="middle" className="w-full">
                <div className="flex justify-between items-center">
                    <Title level={5} className="mb-0">
                        <FlagOutlined className="mr-2" />
                        {content.title}
                    </Title>
                    <Badge count={content.flags} overflowCount={99} />
                </div>
                <Text>{content.description}</Text>
                <Text type="secondary" className="block mt-2">{new Date(content.createdAt).toLocaleString()}</Text>
            </Space>
        </Card>
    );
}
