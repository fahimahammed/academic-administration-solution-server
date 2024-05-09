import { RedisClient } from '../../../shared/redis';

import { EVENT_STUDENT_CREATED, EVENT_STUDENT_UPDATED } from './student.constants';
import { StudentCreatedEvent, StudentUpdatedEvent } from './student.interfaces';
import { StudentService } from './student.service';

const initStudentEvents = () => {
  RedisClient.subscribe(EVENT_STUDENT_CREATED, async (e: string) => {
    const data: StudentCreatedEvent = JSON.parse(e);

    await StudentService.createStudentFromEvent(data);
  });

  RedisClient.subscribe(EVENT_STUDENT_UPDATED, async (e: string) => {
    const data: StudentUpdatedEvent = JSON.parse(e);

    await StudentService.updateStudentFromEvent(data);
  });
};

export default initStudentEvents;
