import config from '../../../config';
import { testGetApi } from '../../../shared/testUtils';

let Id: string = "240100001";
const baseApi: string = `${config.test.baseApi}/student-semester-payments`;

describe('Student Semester Payment Management', () => {

    testGetApi(
        'should retrive all student semester payment',
        baseApi,
        200,
        true,
        "Student semester payment fetched successfully",
        true,
        config.test.adminToken
    );

    testGetApi(
        'should retrive semester payment by semester',
        `${baseApi}/my-semester-payments`,
        200,
        true,
        "Student semester payment fetched successfully",
        true,
        config.test.studentToken
    );

    testGetApi(
        'should not retrive semester payment',
        `${baseApi}/${Id}`,
        400,
        false,
        "RecordNotFound",
        false,
        config.test.adminToken
    );

});
