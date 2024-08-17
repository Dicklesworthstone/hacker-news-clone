import { Card, Typography, Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function JobCard({ job }) {
    return (
        <Card className="mb-4 shadow-lg">
            <Title level={4} className="mb-2">{job.title}</Title>
            <Text>{job.company} ({job.location})</Text>
            <Button type="link" href={job.url} icon={<LinkOutlined />} target="_blank" className="mt-2">
                View Job
            </Button>
        </Card>
    );
}
