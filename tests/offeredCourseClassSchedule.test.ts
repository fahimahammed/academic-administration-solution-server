import { testGetApi } from "./testUtils";
import { baseApi as bApi } from './test.constants';

let Id: string = "testId";
const baseApi: string = `${bApi}/offered-course-class-schedules`;

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
