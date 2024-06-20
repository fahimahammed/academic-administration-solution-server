import config from "../../config";
import { testGetApi } from "../../shared/testUtils";

let Id: string = "testId";
const baseApi: string = `${config.test.baseApi}/offered-courses`;

describe('Offered Course Management', () => {

    testGetApi(
        'should retrive all offered course',
        baseApi,
        200,
        true,
        "OfferedCourses fetched successfully",
        true
    );

    testGetApi(
        'should retrive offered course with id',
        `${baseApi}/${Id}`,
        200,
        true,
        "OfferedCourse fetched successfully",
        true
    );

});
