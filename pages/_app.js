'use client';

import '../styles/globals.css';
import ErrorBoundary from '../components/ErrorBoundary';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { httpLogger } from '../utils/logger';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConfigProvider } from 'antd';
import React from 'react';
import Head from 'next/head';
import SEO from '../components/SEO';

const AntIcons = typeof window !== 'undefined' ? require('@ant-design/icons') : {};

const queryClient = new QueryClient();

// Conditionally import @axe-core/react in client-side only
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    const axe = require('@axe-core/react');
    axe(React, 1000);
}

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url) => {
            console.log(`Navigating to: ${url}`);
            if (httpLogger && httpLogger.logger && httpLogger.logger.info) {
                httpLogger.logger.info(`Route change to ${url}`, { path: router.asPath, query: router.query });
            }
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router]);

    return (
        <ErrorBoundary>
            <ConfigProvider>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
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
