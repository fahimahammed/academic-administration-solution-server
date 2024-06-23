import { testGetApi } from "./testUtils";
import { baseApi as bApi } from './test.constants';

const academicSemesterId: string = "fc721b77-c248-4593-97fc-b280044c8da7";
const baseApi: string = `${bApi}/academic-semesters`;

describe('Academic Semester', () => {
    testGetApi(
        'should retrive all academic semester',
        baseApi,
        200,
        true,
        "AcademicSemesters fetched successfully",
        true
    );

    testGetApi(
        'should retrive academic semester with id',
        `${baseApi}/${academicSemesterId}`,
        200,
        true,
        "AcademicSemester fetched successfully",
        true
    )

});
