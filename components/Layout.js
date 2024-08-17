'use client';

import { Layout as AntLayout, Menu } from 'antd';
import Link from 'next/link';

const { Header, Footer, Content } = AntLayout;

export default function Layout({ children }) {
    return (
        <AntLayout className="min-h-screen">
            <Header className="bg-white shadow-sm mb-4">
                <Menu mode="horizontal" defaultSelectedKeys={['home']} className="flex justify-center">
                    <Menu.Item key="home">
                        <Link href="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="ask">
                        <Link href="/ask">Ask HN</Link>
                    </Menu.Item>
                    <Menu.Item key="show">
                        <Link href="/show">Show HN</Link>
                    </Menu.Item>
                    <Menu.Item key="jobs">
                        <Link href="/jobs">Jobs</Link>
                    </Menu.Item>
                </Menu>
            </Header>
            <Content className="max-w-4xl mx-auto p-4">{children}</Content>
            <Footer className="text-center">© 2024 Hacker News Clone</Footer>
        </AntLayout>
    );
}
