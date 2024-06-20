import config from "../../config";
import { testGetApi } from "../../shared/testUtils";

let Id: string = "testId";
const baseApi: string = `${config.test.baseApi}/student-enrolled-course-marks`;

describe('Student enrolled course mark Management', () => {

    testGetApi(
        'should retrive all student enrolled course marks',
        baseApi,
        200,
        true,
        "Student course marks fetched successfully",
        true,
        config.test.facultyToken
    );

    testGetApi(
        'should retrive student enrolled course with id',
        `${baseApi}/my-marks`,
        200,
        true,
        "Student course marks fetched successfully",
        true,
        config.test.studentToken
    );

});
