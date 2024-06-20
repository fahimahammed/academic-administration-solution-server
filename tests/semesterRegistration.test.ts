import { testGetApi } from "./testUtils";
import { baseApi as bApi } from './test.constants';

let Id: string = "testId";
const baseApi: string = `${bApi}/semester-registrations`;

describe('Semester Registration Management', () => {

    testGetApi(
        'should retrive all semester registration',
        baseApi,
        200,
        true,
        "SemesterRegistrations fetched successfully",
        true
    );

    testGetApi(
        'should retrive my semester registration with access token',
        `${baseApi}/my-registration`,
        200,
        true,
        "Successfully fetched my registration",
        true,
        config.test.studentToken
    );

    // testGetApi(
    //     'should retrive my semester registration courses with access token',
    //     `${baseApi}/my-semester-registration-courses`,
    //     200,
    //     true,
    //     "Successfully fetched my registration courses",
    //     true,
    //     config.test.studentToken
    // );

    testGetApi(
        'should retrive semester registration with id',
        `${baseApi}/${Id}`,
        200,
        true,
        "SemesterRegistration fetched successfully",
        true
    );

});
