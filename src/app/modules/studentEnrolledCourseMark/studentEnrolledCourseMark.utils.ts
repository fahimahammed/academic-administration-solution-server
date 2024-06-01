import { Course, StudentEnrolledCourse } from '@prisma/client';

const getGradeFromMarksAndPoints = (
  marks: number
): {
  grade: string;
  points: number;
} => {
  let result = {
    grade: '',
    points: 0
  };
  if (marks >= 0 && marks <= 34) {
    result = {
      grade: 'F',
      points: 0
    };
  } else if (marks >= 35 && marks <= 39) {
    result = {
      grade: 'D',
      points: 1.50
    };
  } else if (marks >= 40 && marks <= 44) {
    result = {
      grade: 'D+',
      points: 1.75
    };
  } else if (marks >= 45 && marks <= 49) {
    result = {
      grade: 'C-',
      points: 2
    };
  } else if (marks >= 50 && marks <= 54) {
    result = {
      grade: 'C',
      points: 2.25
    };
  } else if (marks >= 55 && marks <= 59) {
    result = {
      grade: 'C+',
      points: 2.50
    };
  } else if (marks >= 60 && marks <= 64) {
    result = {
      grade: 'B-',
      points: 2.75
    };
  } else if (marks >= 65 && marks <= 69) {
    result = {
      grade: 'B',
      points: 3
    };
  } else if (marks >= 70 && marks <= 74) {
    result = {
      grade: 'B+',
      points: 3.25
    };
  } else if (marks >= 75 && marks <= 79) {
    result = {
      grade: 'A-',
      points: 3.50
    };
  } else if (marks >= 80 && marks <= 89) {
    result = {
      grade: 'A',
      points: 3.75
    };
  } else if (marks >= 90 && marks <= 100) {
    result = {
      grade: 'A+',
      points: 4
    };
  }
  return result;
};

const calculateTotalCGPAAndCredit = (
  grades: (StudentEnrolledCourse & { course: Course })[]
): {
  totalCompletedCredit: number;
  cgpa: number;
} => {
  if (grades.length === 0) {
    return {
      totalCompletedCredit: 0,
      cgpa: 0
    };
  }

  let totalPoints = 0;
  let totalCompletedCredit = 0;

  for (const grade of grades) {
    if (grade.status === 'COMPLETED') {
      totalPoints += grade.point || 0;
      totalCompletedCredit += grade.course.credits;
    }
  }

  const averagePoint = Number((totalPoints / grades.length).toFixed(2));
  return {
    totalCompletedCredit,
    cgpa: averagePoint
  };
};

export const StudentEnrolledCourseMarkUtils = {
  getGradeFromMarksAndPoints,
  calculateTotalCGPAAndCredit
};
