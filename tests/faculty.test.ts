import { testGetApi } from "./testUtils";
import { baseApi as bApi } from './test.constants';

const Id: string = "438272525-kshfs-2342";
const baseApi: string = `${bApi}/faculties`;

describe('Faculty Management', () => {
    testGetApi(
        'should retrive all faculty',
        baseApi,
        200,
        true,
        "Faculties fetched successfully",
        true
    );

    testGetApi(
        'should retrive faculty with id',
        `${baseApi}/${Id}`,
        200,
        true,
        "Faculty fetched successfully",
        true
    );

    testGetApi(
        'should retrive faculty with id',
        `${baseApi}/profile/${Id}`,
        200,
        true,
        "Faculty fetched successfully",
        true
    );

});
