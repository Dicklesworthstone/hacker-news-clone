import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.post('/api/signup', { username: values.username, password: values.password });
            message.success('Sign up successful!');
            router.push('/login');
        } catch (error) {
            message.error('Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-8 shadow-lg">
                <Title level={3} className="text-center mb-6">Sign Up</Title>
                <Form
                    name="signup"
                    initialValues={{ remember: true }}
                    onFinish={handleSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Username"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full"
                            size="large"
                            loading={loading}
                        >
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
