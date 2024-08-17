import request from 'supertest';
import app from '../../app';  // Adjust this path based on your actual server entry point

describe('Notifications API', () => {
    it('should fetch all notifications for a user', async () => {
        const res = await request(app).get('/api/notifications?userId=1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('notifications');
    });

    // Additional API tests
});
