import { OfferedCourseClassSchedule, WeekDays } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import prisma from '../../../shared/prisma';
import { hasTimeConflict } from '../../../shared/utils';

const checkIfRoomIsAvailable = async (classSchedule: OfferedCourseClassSchedule): Promise<void> => {
  const result = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      room: { id: classSchedule.roomId },
      dayOfWeek: classSchedule.dayOfWeek as WeekDays
    }
  });

  const existingSlots = result.map((schedule) => ({
    dayOfWeek: schedule.dayOfWeek,
    startTime: schedule.startTime,
    endTime: schedule.endTime
  }));

  const newSlot = {
    dayOfWeek: classSchedule.dayOfWeek,
    startTime: classSchedule.startTime,
    endTime: classSchedule.endTime
  };

  if (hasTimeConflict(existingSlots, newSlot)) {
    throw new ApiError(httpStatus.CONFLICT, 'Room is already booked');
  }
};

const checkIfFacultyIsAvailable = async (
  classSchedule: OfferedCourseClassSchedule
): Promise<void> => {
  const result = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      faculty: { id: classSchedule.facultyId },
      dayOfWeek: classSchedule.dayOfWeek as WeekDays
    }
  });

  const existingSlots = result.map((schedule) => ({
    dayOfWeek: schedule.dayOfWeek,
    startTime: schedule.startTime,
    endTime: schedule.endTime
  }));

  const newSlot = {
    dayOfWeek: classSchedule.dayOfWeek,
    startTime: classSchedule.startTime,
    endTime: classSchedule.endTime
  };

  if (hasTimeConflict(existingSlots, newSlot)) {
    throw new ApiError(httpStatus.CONFLICT, 'Faculty has already booked a class at this time');
  }
};

export const OfferedCourseSectionUtils = {
  checkIfRoomIsAvailable,
  checkIfFacultyIsAvailable
};
