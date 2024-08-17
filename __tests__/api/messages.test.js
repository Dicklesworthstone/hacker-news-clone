import request from 'supertest';
import app from '../../app';  // Adjust this path based on your actual server entry point

describe('Messages API', () => {
    it('should fetch all messages for a user', async () => {
        const res = await request(app).get('/api/messages?userId=1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('messages');
    });

    // Additional API tests
});
