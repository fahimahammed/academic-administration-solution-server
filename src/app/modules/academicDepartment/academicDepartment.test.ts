import request from 'supertest';
import app from '../../../app';

describe('Academic Department', () => {
    it('should retrive all academic department', async () => {
        const res = await request(app)
            .get('/api/v1/academic-departments')

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toEqual('Academic Departments fetched successfully');
        expect(res.body.data).toBeDefined();
    });

});
