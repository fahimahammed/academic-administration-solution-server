import request from 'supertest';
import app from '../../../app';
import config from '../../../config';

const baseApi: string = `${config.testBase}/users`;
const userId: string = "0a9ea16a-646d-42ca-9a43-8a25b632040e";

describe('User Management', () => {
    it('should retrive all user', async () => {
        const res = await request(app)
            .get(baseApi)

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toEqual('Users fetched successfully');
        expect(res.body.data).toBeDefined();
    });

    it('should not retrive profile data without access token', async () => {
        const res = await request(app)
            .get(`${baseApi}/my-profile`)

        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBeFalsy();
        expect(res.body.message).toEqual('Unauthorized');
        //expect(res.body.data).toBeNull();
    });

    it('should retrive profile data with id', async () => {
        const res = await request(app)
            .get(`${baseApi}/${userId}`)

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toEqual('User fetched successfully');
        expect(res.body.data).toBeDefined();
    });

});
