'use client';import '../styles/globals.css'; // Adjusted the path to relative

import ErrorBoundary from '../components/ErrorBoundary';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { httpLogger } from '../utils/logger';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConfigProvider } from 'antd';
import dynamic from 'next/dynamic';
import React from 'react';
import SEO from '../components/SEO';

// Conditionally import Ant Design icons if in a client environment
const AntIcons = typeof window !== 'undefined' ? require('@ant-design/icons') : {};

const queryClient = new QueryClient();

if (process.env.NODE_ENV !== 'production') {
    const axe = require('@axe-core/react');
    axe(React, 1000);
}

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url) => {
            console.log(`Navigating to: ${url}`);
            httpLogger(router.asPath, router.query); // Log the HTTP request
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router]);

    return (
        <ErrorBoundary>
            <ConfigProvider>
                <SEO 
                    title="Hacker News Clone" 
                    description="A clone of Hacker News built with Next.js" 
                    keywords="Hacker News, Next.js, Clone, Posts, Discussions"
                />
                <QueryClientProvider client={queryClient}>
                    <Component {...pageProps} AntIcons={AntIcons} />
                </QueryClientProvider>
            </ConfigProvider>
        </ErrorBoundary>
    );
}

export default MyApp;
