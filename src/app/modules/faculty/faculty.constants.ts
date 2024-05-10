export const facultyFilterableFields: string[] = [
  'searchTerm',
  'userId',
  'email',
  'contactNo',
  'gender',
  'bloodGroup',
  'gender',
  'designation',
  'academicFacultyId',
  'academicDepartmentId'
];

export const facultySearchableFields: string[] = [
  'firstName',
  'lastName',
  'middleName',
  'email',
  'contactNo',
  'userId',
  'designation'
];

export const facultyRelationalFields: string[] = ['academicFacultyId', 'academicDepartmentId'];
export const facultyRelationalFieldsMapper: { [key: string]: string } = {
  academicFacultyId: 'academicFaculty',
  academicDepartmentId: 'academicDepartment'
};

export const EVENT_FACULTY_CREATED = 'faculty.created';
export const EVENT_FACULTY_UPDATED = 'faculty.updated';
