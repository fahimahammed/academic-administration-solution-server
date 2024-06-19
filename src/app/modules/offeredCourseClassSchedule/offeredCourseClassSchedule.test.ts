import config from '../../../config';
import { testGetApi } from '../../../shared/testUtils';

let Id: string = "testId";
const baseApi: string = `${config.test.baseApi}/offered-course-class-schedules`;

describe('Offered Course Class Schedule Management', () => {

    testGetApi(
        'should retrive all offered course class schedule',
        baseApi,
        200,
        true,
        "OfferedCourseClassSchedules fetched successfully",
        true
    );

    testGetApi(
        'should retrive offered course class schedule with id',
        `${baseApi}/${Id}`,
        200,
        true,
        "OfferedCourseClassSchedule fetched successfully",
        true
    );

});
