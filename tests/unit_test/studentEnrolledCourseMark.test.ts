import { testGetApi } from "./testUtils";
import { baseApi as bApi, facultyToken, studentToken } from './test.constants';

let Id: string = "testId";
const baseApi: string = `${bApi}/student-enrolled-course-marks`;

describe('Student enrolled course mark Management', () => {

    testGetApi(
        'should retrive all student enrolled course marks',
        baseApi,
        200,
        true,
        "Student course marks fetched successfully",
        true,
        facultyToken
    );

    testGetApi(
        'should retrive student enrolled course with id',
        `${baseApi}/my-marks`,
        200,
        true,
        "Student course marks fetched successfully",
        true,
        studentToken
    );

});
