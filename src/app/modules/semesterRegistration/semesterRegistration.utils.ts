import { StudentEnrolledCourse } from '@prisma/client';
import {
  AlreadyTakenCoursesInSemester,
  AvailableCourseResult,
  SemesterOfferedCourses
} from './semesterRegistration.interfaces';

const getAvailableCourses = (
  offeredCourses: SemesterOfferedCourses,
  studentCompletedCourses: StudentEnrolledCourse[],
  studentCurrentSemesterTakenCourses: AlreadyTakenCoursesInSemester
): AvailableCourseResult => {
  const completedCourseIds = studentCompletedCourses.map((course) => course.courseId);
  // TODO: need to optimize this
  const availableCourses = offeredCourses
    .filter((offeredCourse) => !completedCourseIds.includes(offeredCourse.courseId))
    .filter((course) => {
      const prerequisites = course.course.prerequisites;
      if (prerequisites.length === 0) {
        return true;
      } else {
        const prerequisiteIds = prerequisites.map((prerequisite) => prerequisite.prerequisiteId);
        return prerequisiteIds.every((id) => completedCourseIds.includes(id));
      }
    })
    .map((course) => {
      const isAlreadyTaken = studentCurrentSemesterTakenCourses.find(
        (c) => c.offeredCourseId === course.id
      );
      if (isAlreadyTaken) {
        course.offeredCourseSections.map((section) => {
          if (section.id === isAlreadyTaken.offeredCourseSectionId) {
            section.isTaken = true;
          } else {
            section.isTaken = false;
          }
        });
        return {
          ...course,
          isTaken: true
        };
      } else {
        course.offeredCourseSections.map((section) => {
          section.isTaken = false;
        });
        return {
          ...course,
          isTaken: false
        };
      }
    });

  return availableCourses;
};

export const SemesterRegistrationUtils = {
  getAvailableCourses
};
