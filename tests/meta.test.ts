import { testGetApi } from "./testUtils";
import { baseApi as bApi } from './test.constants';

const baseApi: string = `${bApi}/meta`;

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
