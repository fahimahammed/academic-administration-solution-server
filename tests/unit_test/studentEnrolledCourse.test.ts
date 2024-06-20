import { testGetApi } from "./testUtils";
import { baseApi as bApi } from './test.constants';

let Id: string = "testId";
const baseApi: string = `${bApi}/student-enrolled-courses`;

describe('Room Management', () => {

    testGetApi(
        'should retrive all student enrolled courses',
        baseApi,
        200,
        true,
        "StudentEnrolledCourses fetched successfully",
        true
    );

    testGetApi(
        'should retrive student enrolled course with id',
        `${baseApi}/${Id}`,
        200,
        true,
        "StudentEnrolledCourse fetched successfully",
        true
    );

});
