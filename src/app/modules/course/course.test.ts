import config from '../../../config';
import { testGetApi } from '../../../shared/testUtils';

const Id: string = "438272525-kshfs-2342";
const baseApi: string = `${config.test.baseApi}/courses`;

describe('Course Management', () => {
    testGetApi(
        'should retrive all course',
        baseApi,
        200,
        true,
        "Courses fetched successfully",
        true
    );

    testGetApi(
        'should retrive course with id',
        `${baseApi}/${Id}`,
        200,
        true,
        "Course fetched successfully",
        true
    )

});
