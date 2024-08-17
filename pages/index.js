'use client';

import React from 'react';
import { useInfiniteQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { Card, Avatar, Typography, Spin, List, Button } from 'antd';
import { UserOutlined, LikeOutlined, MessageOutlined, LoadingOutlined } from '@ant-design/icons';
import SEO from '../components/SEO';
import { getCachedData, setCachedData } from '../utils/cache';

const { Title, Text } = Typography;

// Function to fetch posts, with caching implemented
const fetchPosts = async ({ pageParam = 1 }) => {
    const cacheKey = `posts-page-${pageParam}`;
    let data = getCachedData(cacheKey);

    if (!data) {
        const response = await axios.get(`/api/posts?page=${pageParam}`);
        data = response.data;
        setCachedData(cacheKey, data);
    }

    return data;
};

export default function Home() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery('posts', fetchPosts, {
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length === 10) {
                return pages.length + 1;
            } else {
                return undefined;
            }
        },
    });

    const posts = data?.pages.flat() || [];

    return (
        <>
            <SEO 
                title="Home | Hacker News Clone" 
                description="A clone of Hacker News built with Next.js, offering the latest posts and discussions."
                keywords="Hacker News, Next.js, Clone, Posts, Discussions"
            />
            <div className="max-w-4xl mx-auto p-4">
                <Title level={2} className="text-center mb-6">Hacker News Clone</Title>
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchNextPage}
                    hasMore={hasNextPage}
                    loader={
                        <div className="flex justify-center py-4">
                            <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        </div>
                    }
                    endMessage={
                        <div className="text-center py-4">
                            <Text>No more posts to load</Text>
                        </div>
                    }
                >
                    <List
                        dataSource={posts}
                        renderItem={post => (
                            <List.Item
                                key={post.id}
                                className="bg-white rounded-lg shadow-md p-4 mb-4"
                                actions={[
                                    <Button key="like" type="link" icon={<LikeOutlined />}>
                                        {post.upvotes}
                                    </Button>,
                                    <Button key="comment" type="link" icon={<MessageOutlined />}>
                                        {post.commentCount || 0}
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    title={
                                        <a href={`/posts/${post.id}`} className="text-lg font-semibold">
                                            {post.title}
                                        </a>
                                    }
                                    description={`By ${post.author.username}`}
                                />
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
                {isFetchingNextPage && (
                    <div className="text-center py-4">
                        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        <Text className="ml-2">Loading more posts...</Text>
                    </div>
                )}
            </div>
        </>
    );
}
