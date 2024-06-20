import config from "../../config";
import { testGetApi } from "../../shared/testUtils";

let academicFacultyId: string = "testId";
const baseApi: string = `${config.test.baseApi}/academic-faculties`;

// const postData = {
//     title: "test academic faculty"
// }

describe('Academic Faculty', () => {
    // const testPostRes = testPostApi(
    //     'should insert data of academic faculty on database',
    //     baseApi,
    //     postData,
    //     201,
    //     true,
    //     'AcademicFaculty created successfully',
    //     true,
    //     config.test.adminToken
    // );

    testGetApi(
        'should retrive all academic department',
        baseApi,
        200,
        true,
        "AcademicFaculties fetched successfully",
        true
    );

    testGetApi(
        'should retrive academic faculty with id',
        `${baseApi}/${academicFacultyId}`,
        200,
        true,
        "AcademicFaculty fetched successfully",
        true
    );

});
