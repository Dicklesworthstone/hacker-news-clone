import React from 'react';
import { Avatar, Card, Button, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Example = () => {
    return (
        <Card className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg">
            <Avatar size={64} icon={<UserOutlined />} className="mb-4" />
            <Title level={3} className="text-center">Welcome to the Hacker News Clone</Title>
            <Text className="block text-center mb-4">This is a simple demonstration of using Ant Design with Tailwind CSS.</Text>
            <Button type="primary" block className="mt-4">Get Started</Button>
        </Card>
    );
};

export default Example;
