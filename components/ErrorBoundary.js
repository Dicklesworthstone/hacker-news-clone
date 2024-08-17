'use client';

import React, { Component } from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error boundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Result
                    status="500"
                    title="Something went wrong"
                    subTitle="Please try again later."
                    extra={<Button type="primary" onClick={() => window.location.reload()}>Reload</Button>}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
