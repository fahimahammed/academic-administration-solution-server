function groupByAcademicSemester(data: any) {
  const groupedData = data.reduce((result: any, course: any) => {
    const academicSemester = course.academicSemester;
    const academicSemesterId = academicSemester.id;

    const existingGroup = result.find(
      (group: any) => group.academicSemester.id === academicSemesterId
    );

    if (existingGroup) {
      existingGroup.completedCourses.push({
        id: course.id,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        studentId: course.studentId,
        courseId: course.courseId,
        grade: course.grade,
        point: course.point,
        totalMarks: course.totalMarks,
        status: course.status,
        course: course.course
      });
    } else {
      result.push({
        academicSemester,
        completedCourses: [
          {
            id: course.id,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
            studentId: course.studentId,
            courseId: course.courseId,
            grade: course.grade,
            point: course.point,
            totalMarks: course.totalMarks,
            status: course.status,
            course: course.course
          }
        ]
      });
    }

    return result;
  }, []);

  return groupedData;
}

export const StudentUtils = {
  groupByAcademicSemester
};
