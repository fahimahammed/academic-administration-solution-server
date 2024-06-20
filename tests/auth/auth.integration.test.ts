import request from 'supertest';
import app from '../../src/app';

describe('Authentication API', () => {
    let refreshToken: string;
    let accessToken: string;

    it('should login a user with valid credentials', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                id: 'A-00001',
                password: '123456'
            });

        expect(res.status).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toEqual('Logged in successfully!');
        expect(res.body.data.accessToken).toBeDefined();
        expect(res.body.data.refreshToken).toBeDefined();

        accessToken = res.body.data.accessToken;
        refreshToken = res.body.data.refreshToken; // Save refresh token for later tests
    });

    it('should refresh the access token', async () => {
        const res = await request(app)
            .post('/api/v1/auth/refresh-token')
            .set('Cookie', `refreshToken=${refreshToken}`);

        expect(res.status).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toEqual('Access token generated successfully!');
        expect(res.body.data.accessToken).toBeDefined();
    });

    it('should change user password', async () => {
        const res = await request(app)
            .post('/api/v1/auth/change-password')
            .set('Authorization', `${accessToken}`)
            .send({
                oldPassword: '123456',
                newPassword: '123456'
            });

        expect(res.status).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toEqual('Password Changed successfully');
    });

    it('should send forgot password email', async () => {
        const res = await request(app)
            .post('/api/v1/auth/forgot-password')
            .send({ userId: 'A-00001' })

        expect(res.status).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toEqual('Check your email!');
    }, 100000);

    it('should reset user password', async () => {
        // Simulate forgot password to get a reset token
        const forgotRes = await request(app)
            .post('/api/v1/auth/forgot-password')
            .send({ userId: 'user_id_here' });

        // Assume you have a way to extract the reset token from the email
        const resetToken = 'extracted_reset_token_here_invalid';

        const res = await request(app)
            .post('/api/v1/auth/reset-password')
            .send({
                userId: 'A-00001',
                newPassword: '123456',
                token: resetToken
            });

        expect(res.status).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toEqual('Password reset successfully. Please login with new password');
    });
});
