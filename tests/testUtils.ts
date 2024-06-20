import request from 'supertest';
import app from '../src/app';

// Utility function to test GET API endpoints with optional access token
export const testGetApi = (
    title: string,
    api: string,
    expectedStatusCode: number,
    expectedSuccess: boolean,
    expectedMessage: string,
    shouldBodyBeDefined: boolean,
    token?: string
) => {
    it(title, async () => {
        const req = request(app).get(api);
        if (token) {
            req.set('Authorization', `${token}`);
        }
        const response = await req;

        expect(response.status).toBe(expectedStatusCode);
        expect(response.body.success).toBe(expectedSuccess);
        expect(response.body.message).toBe(expectedMessage);
        if (shouldBodyBeDefined) {
            expect(response.body.data).toBeDefined();
        }
    });
};

export const testPostApi = (
    title: string,
    api: string,
    postData: object,
    expectedStatusCode: number,
    expectedSuccess: boolean,
    expectedMessage: string,
    shouldBodyBeDefined: boolean,
    token?: string
) => {

    it(title, async () => {
        const req = request(app).post(api).send(postData);
        if (token) {
            req.set('Authorization', `${token}`);
        }
        const response = await req;

        expect(response.status).toBe(expectedStatusCode);
        expect(response.body.success).toBe(expectedSuccess);
        expect(response.body.message).toBe(expectedMessage);
        if (shouldBodyBeDefined) {
            expect(response.body.data).toBeDefined();
        }
    });
};

export const testDeleteApi = (
    title: string,
    api: string,
    expectedStatusCode: number,
    expectedSuccess: boolean,
    expectedMessage: string,
    token?: string
) => {
    it(title, async () => {
        const req = request(app).delete(api);
        if (token) {
            req.set('Authorization', `${token}`);
        }
        const response = await req;

        expect(response.status).toBe(expectedStatusCode);
        expect(response.body.success).toBe(expectedSuccess);
        expect(response.body.message).toBe(expectedMessage);
    });
};

export const testUpdateApi = (
    title: string,
    api: string,
    updateData: object,
    expectedStatusCode: number,
    expectedSuccess: boolean,
    expectedMessage: string,
    shouldBodyBeDefined: boolean,
    token?: string,
    method: 'put' | 'patch' = 'put'
) => {
    it(title, async () => {
        const req = request(app)[method](api).send(updateData);
        if (token) {
            req.set('Authorization', `${token}`);
        }
        const response = await req;

        expect(response.status).toBe(expectedStatusCode);
        expect(response.body.success).toBe(expectedSuccess);
        expect(response.body.message).toBe(expectedMessage);
        if (shouldBodyBeDefined) {
            expect(response.body.data).toBeDefined();
        }
    });
};