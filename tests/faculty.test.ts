import { testGetApi } from "./testUtils";
import config from "../src/config";

const Id: string = "438272525-kshfs-2342";
const baseApi: string = `${config.test.baseApi}/faculties`;

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
