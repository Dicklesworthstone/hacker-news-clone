'use client';

import { useQuery } from 'react-query';
import axios from 'axios';
import { Typography, Spin, Alert, List, Card, Button } from 'antd';
import { LoadingOutlined, LinkOutlined } from '@ant-design/icons';

const { Title } = Typography;

const fetchJobs = async () => {
    const { data } = await axios.get('/api/jobs');
    return data;
};

export default function Jobs() {
    const { data: jobs, isLoading, error } = useQuery('jobs', fetchJobs);

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
                <Title level={2} className="text-center mb-4">Job Board</Title>
                <List
                    itemLayout="vertical"
                    dataSource={jobs}
                    renderItem={job => (
                        <List.Item
                            key={job.id}
                            className="bg-white rounded-lg p-4 shadow-sm mb-4"
                            actions={[
                                <Button key={`view-${job.id}`} type="link" href={job.url} icon={<LinkOutlined />} target="_blank">
                                    View Job
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={<a href={job.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold">{job.title}</a>}
                                description={`${job.company} (${job.location})`}
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
}
