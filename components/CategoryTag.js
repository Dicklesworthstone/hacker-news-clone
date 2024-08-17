'use client';

import { Tag } from 'antd';

export default function CategoryTag({ category }) {
    let color;
    switch (category) {
        case 'Show HN':
            color = 'green';
            break;
        case 'Ask HN':
            color = 'orange';
            break;
        case 'Job':
            color = 'blue';
            break;
        default:
            color = 'gray';
    }

    return (
        <Tag color={color} className="mb-2">
            {category}
        </Tag>
    );
}
