import { testGetApi } from "./testUtils";
import { adminToken, baseApi as bApi, studentToken } from './test.constants';

let Id: string = "240100001";
const baseApi: string = `${bApi}/student-semester-payments`;

describe('Student Semester Payment Management', () => {

    testGetApi(
        'should retrive all student semester payment',
        baseApi,
        200,
        true,
        "Student semester payment fetched successfully",
        true,
        adminToken
    );

    testGetApi(
        'should retrive semester payment by semester',
        `${baseApi}/my-semester-payments`,
        200,
        true,
        "Student semester payment fetched successfully",
        true,
        studentToken
    );

    testGetApi(
        'should not retrive semester payment',
        `${baseApi}/${Id}`,
        400,
        false,
        "RecordNotFound",
        false,
        adminToken
    );

});
