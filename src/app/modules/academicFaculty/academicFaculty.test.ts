import request from 'supertest';
import app from '../../../app';
import config from '../../../config';
import { testGetApi } from '../../../shared/testUtils';

const academicFacultyId: string = "fc721b77-c248-4593-97fc-b280044c8da7";
const baseApi: string = `${config.testBase}/academic-faculties`;

describe('Academic Faculty', () => {
    testGetApi(
        'should retrive all academic department',
        baseApi,
        200,
        true,
        "AcademicFaculties fetched successfully",
        true
    );

    testGetApi(
        'should retrive academic department with id',
        `${baseApi}/${academicFacultyId}`,
        200,
        true,
        "AcademicFaculty fetched successfully",
        true
    )

});
