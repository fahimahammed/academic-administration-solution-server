export const offeredCourseClassScheduleFilterableFields: string[] = [
  'searchTerm',
  'id',
  'dayOfWeek',
  'offeredCourseSectionId',
  'semesterRegistrationId',
  'facultyId',
  'roomId'
];

export const offeredCourseClassScheduleSearchableFields: string[] = ['dayOfWeek'];

export const offeredCourseClassScheduleRelationalFields: string[] = [
  'offeredCourseSectionId',
  'facultyId',
  'roomId',
  'semesterRegistrationId'
];
export const offeredCourseClassScheduleRelationalFieldsMapper: { [key: string]: string } = {
  offeredCourseSectionId: 'offeredCourseSection',
  facultyId: 'faculty',
  roomId: 'room',
  semesterRegistrationId: 'semesterRegistration'
};

export const daysInWeek = [
  'SATURDAY',
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY'
];
