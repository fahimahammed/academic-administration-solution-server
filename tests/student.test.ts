import { testGetApi } from "./testUtils";
import { baseApi as bApi, studentToken } from './test.constants';

let Id: string = "240100001";
const baseApi: string = `${bApi}/students`;

describe('Student Management', () => {

    testGetApi(
        'should retrive all student',
        baseApi,
        200,
        true,
        "Students fetched successfully",
        true
    );

    testGetApi(
        'should retrive student with id',
        `${baseApi}/profile/${Id}`,
        200,
        true,
        "Student fetched successfully",
        true
    );

    testGetApi(
        'should retrive all student courses with access token',
        `${baseApi}/my-courses`,
        200,
        true,
        "Student courses fetched successfully",
        true,
        studentToken
    );

    testGetApi(
        'should retrive student academic info with access token',
        `${baseApi}/my-academic-infos`,
        200,
        true,
        "Student academic info fetched successfully",
        true,
        studentToken
    );

    testGetApi(
        'should retrive student course schedules with access token',
        `${baseApi}/my-course-schedules`,
        200,
        true,
        "Student course schedules fetched successfully",
        true,
        studentToken
    );

});
