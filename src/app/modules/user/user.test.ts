import request from 'supertest';
import app from '../../../app';
import config from '../../../config';
import { testGetApi } from '../../../shared/testUtils';

const baseApi: string = `${config.test.baseApi}/users`;
const userId: string = "0a9ea16a-646d-42ca-9a43-8a25b632040e";

describe('User Management', () => {
    testGetApi(
        'should retrive all user',
        baseApi,
        200,
        true,
        'Users fetched successfully',
        true
    );

    testGetApi(
        'should not retrive profile data without access token',
        `${baseApi}/my-profile`,
        401,
        false,
        'Unauthorized',
        false
    );

    testGetApi(
        'should retrive profile data with id',
        `${baseApi}/${userId}`,
        200,
        true,
        'User fetched successfully',
        true
    );

});
