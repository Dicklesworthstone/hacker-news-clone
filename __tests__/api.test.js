import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/jobs/[id].js'; // Example for jobs API

describe('/api/jobs/[id]', () => {
    it('returns a job by id', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { id: '1' }, // Assuming you have a job with ID 1
        });

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toHaveProperty('id', 1);
    });
});
