import request from 'supertest';
import app from '../../src/app';
import { baseApi as bApi } from './test.constants';


const baseApi: string = `${bApi}/auth`;

describe('Authentication', () => {
    it('should login a user (SUPER ADMIN) with valid credentials', async () => {
        const res = await request(app)
            .post(`${baseApi}/login`)
            .send({
                id: '00001',
                password: '123456'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toEqual('Logged in successfully!');
        expect(res.body.data.accessToken).toBeDefined();
        expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should login a user (ADMIN) with valid credentials', async () => {
        const res = await request(app)
            .post(`${baseApi}/login`)
            .send({
                id: 'A-00001',
                password: '123456'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toEqual('Logged in successfully!');
        expect(res.body.data.accessToken).toBeDefined();
        expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should login a user (FACULTY) with valid credentials', async () => {
        const res = await request(app)
            .post(`${baseApi}/login`)
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
    it('should login a user (STUDENT) with valid credentials', async () => {
        const res = await request(app)
            .post(`${baseApi}/login`)
            .send({
                id: '240100001',
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
            .post(`${baseApi}/login`)
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
            .post(`${baseApi}/login`)
            .send({
                id: 'nonexistentID',
                password: '123456'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBeFalsy();
        expect(res.body.message).toEqual('RecordNotFound');
        //expect(res.body.data).toBeNull();
    });

    it('should not refresh the access token', async () => {
        const res = await request(app)
            .post(`${baseApi}/refresh-token`)

        expect(res.statusCode).toEqual(500);
        expect(res.body.success).toBeFalsy();
    });
});