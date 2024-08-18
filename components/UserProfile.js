'use client';

import { Card, Typography, Avatar, List, Badge, Tabs } from 'antd';
import { UserOutlined, MessageOutlined, BellOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { marked } from 'marked';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function UserProfile({ user }) {
    return (
        <Card className="shadow-lg mb-6">
            <div className="flex items-center mb-6">
                <Avatar size={64} icon={<UserOutlined />} className="mr-4" />
                <div>
                    <Title level={3} className="mb-0">{user.username}</Title>
                    <Text className="text-gray-600">Karma: {user.karma}</Text>
                </div>
            </div>
            <Tabs defaultActiveKey="1">
                <TabPane
                    tab={
                        <span>
                            <UserOutlined />
                            Profile
                        </span>
                    }
                    key="1"
                >
                    <div className="mt-4">
                        <Title level={4}>Biography</Title>
                        {user.biography ? (
                            <div dangerouslySetInnerHTML={{ __html: marked(user.biography) }} />
                        ) : (
                            <Text>No biography available.</Text>
                        )}
                    </div>
                    <div className="mt-4">
                        <Title level={4}>Recent Posts</Title>
                        <List
                            dataSource={user.posts}
                            renderItem={post => (
                                <List.Item>
                                    <Link href={`/posts/${post.id}`}>
                                        <a className="text-blue-500 hover:underline">{post.title}</a>
                                    </Link>
                                </List.Item>
                            )}
                        />
                    </div>
                    <div className="mt-4">
                        <Title level={4}>Recent Comments</Title>
                        <List
                            dataSource={user.comments}
                            renderItem={comment => (
                                <List.Item>
                                    <Link href={`/posts/${comment.postId}#comment-${comment.id}`}>
                                        <a className="text-blue-500 hover:underline">{comment.content}</a>
                                    </Link>
                                </List.Item>
                            )}
                        />
                    </div>
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <MessageOutlined />
                            Messages
                        </span>
                    }
                    key="2"
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={user.messages}
                        renderItem={message => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<MessageOutlined />} />}
                                    title={<Text strong>{message.title}</Text>}
                                    description={message.content}
                                />
                            </List.Item>
                        )}
                    />
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <BellOutlined />
                            Notifications
                        </span>
                    }
                    key="3"
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={user.notifications}
                        renderItem={notification => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Badge count={notification.unread ? 1 : 0} offset={[10, 0]}>
                                        <Avatar icon={<BellOutlined />} />
                                    </Badge>}
                                    title={<Text strong>{notification.title}</Text>}
                                    description={notification.content}
                                />
                            </List.Item>
                        )}
                    />
                </TabPane>
            </Tabs>
        </Card>
    );
}
