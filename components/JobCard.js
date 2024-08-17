'use client';

import { Card, Typography, Button, Tag, Space } from 'antd';
import { LinkOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function JobCard({ job }) {
    return (
        <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow">
            <Space direction="vertical" size="middle" className="w-full">
                <div className="flex justify-between items-center">
                    <Title level={4} className="mb-0">{job.title}</Title>
                    <Tag color="blue">{job.category}</Tag>
                </div>
                <Text>{job.company}</Text>
                <Text type="secondary" className="flex items-center">
                    <EnvironmentOutlined className="mr-1" />
                    {job.location}
                </Text>
                <Text>{job.description}</Text>
                <Button 
                    type="link" 
                    href={job.url} 
                    icon={<LinkOutlined />} 
                    target="_blank" 
                    className="mt-2"
                >
                    View Job
                </Button>
            </Space>
        </Card>
    );
}
