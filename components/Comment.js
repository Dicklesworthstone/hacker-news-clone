'use client';

import React from 'react';
import { Avatar, Card, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { marked } from 'marked';

const { Text } = Typography;

const Comment = ({ comment, children }) => {
    return (
        <Card bordered={false} className="mb-4 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start">
                <Avatar icon={<UserOutlined />} size="large" className="mr-4" />
                <div className="flex-1">
                    <Text className="block font-semibold">{comment.author.username}</Text>
                    <div dangerouslySetInnerHTML={{ __html: marked(comment.content) }} className="block text-gray-600 mb-2" />
                    {children && (
                        <div className="ml-10 mt-2 border-l pl-4">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default Comment;
