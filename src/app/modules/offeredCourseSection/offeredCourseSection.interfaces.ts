import { WeekDays } from '@prisma/client';

export interface IOfferedCourseSectionFilterRequest {
  searchTerm?: string | undefined;
  offeredCourseId?: string | undefined;
}

export type CreateClassSchedulePayload = {
  dayOfWeek: WeekDays;
  startTime: string;
  endTime: string;
  roomId: string;
  facultyId: string;
  offeredCourseSectionId: string;
};

export type CreateOfferedCourseSectionPayload = {
  offeredCourseId: string;
  maxCapacity: number;
  title: string;
  classSchedules: CreateClassSchedulePayload[];
};
