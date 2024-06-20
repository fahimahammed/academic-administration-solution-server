import { testGetApi } from "./testUtils";
import config from "../src/config";

let Id: string = "testId";
const baseApi: string = `${config.test.baseApi}/student-enrolled-courses`;

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
