import request from 'supertest';
import app from '../../../app';

describe('Auth Service', () => {
    it('should login a user with valid credentials', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                id: 'F-00001',
                password: '123456'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toEqual('Logged in successfully!');
        expect(res.body.data.accessToken).toBeDefined();
        expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should return 401 Unauthorized for wrong password', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                id: 'F-00001',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBeFalsy();
        expect(res.body.message).toEqual('Incorrect password');
        //expect(res.body.data).toBeNull();
    });

    it('should return 404 Not Found for non-existent user ID', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                id: 'nonexistentID',
                password: '123456'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBeFalsy();
        expect(res.body.message).toEqual('RecordNotFound');
        //expect(res.body.data).toBeNull();
    });
});
