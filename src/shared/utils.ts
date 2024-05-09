export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) {
    throw Error('Expected an array');
  }
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const hideEmail = (email: string) => {
  var hiddenEmail = '';
  var visibleChars = 4;

  for (var i = 0; i < email.length; i++) {
    if (i < visibleChars || email[i] === '@') {
      hiddenEmail += email[i];
    } else {
      hiddenEmail += '*';
    }
  }

  return hiddenEmail;
};

export const hasTimeConflict = (
  existingSlots: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }[],
  newSlot: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }
) => {
  for (const slot of existingSlots) {
    if (slot.dayOfWeek === newSlot.dayOfWeek) {
      const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
      const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);
      const newStart = new Date(`1970-01-01T${newSlot.startTime}:00`);
      const newEnd = new Date(`1970-01-01T${newSlot.endTime}:00`);

      if (newStart < existingEnd && newEnd > existingStart) {
        return true;
      }
    }
  }

  return false;
};
