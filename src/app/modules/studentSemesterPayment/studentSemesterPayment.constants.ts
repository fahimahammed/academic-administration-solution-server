export const studentSemesterPaymentFilterableFields: string[] = ['academicSemesterId', 'studentId', 'searchTerm'];

export const studentSemesterPaymentSearchableFields: string[] = ['userId', 'firstName', 'lastName', 'middleName'];

export const studentSemesterPaymentRelationalFields: string[] = ['academicSemesterId', 'userId'];
export const studentSemesterPaymentRelationalFieldsMapper: { [key: string]: string } = {
  academicSemesterId: 'academicSemester',
  userId: 'student'
};
