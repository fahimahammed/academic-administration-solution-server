import { testGetApi } from "./testUtils";
import { baseApi as bApi } from './test.constants';

const academicDepartmentId: string = "fc721b77-c248-4593-97fc-b280044c8da7";
const baseApi: string = `${bApi}/academic-departments`;

const postData = {

}

describe('Academic Department', () => {
    testGetApi(
        "should retrive all academic department",
        baseApi,
        200,
        true,
        'Academic Departments fetched successfully',
        true
    );

    testGetApi(
        "should retrive all academic department",
        `${baseApi}/${academicDepartmentId}`,
        200,
        true,
        'AcademicDepartment fetched successfully',
        true
    );

});
