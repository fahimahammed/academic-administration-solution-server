import config from '../../../config';
import { testGetApi } from '../../../shared/testUtils';

let Id: string = "testId";
const baseApi: string = `${config.test.baseApi}/offered-course-sections`;

describe('Offered Course Section Management', () => {

    testGetApi(
        'should retrive all offered course section',
        baseApi,
        200,
        true,
        "OfferedCourseSections fetched successfully",
        true
    );

    testGetApi(
        'should retrive offered course section with id',
        `${baseApi}/${Id}`,
        200,
        true,
        "OfferedCourseSection fetched successfully",
        true
    );

});
