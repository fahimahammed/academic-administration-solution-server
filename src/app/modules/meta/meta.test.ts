import config from '../../../config';
import { testGetApi } from '../../../shared/testUtils';

const baseApi: string = `${config.test.baseApi}/meta`;

describe('Meta Data', () => {
    testGetApi(
        'should retrive all meta information',
        baseApi,
        200,
        true,
        "Meta data fetched successfully",
        true,
        config.test.superAdminToken
    );

});
