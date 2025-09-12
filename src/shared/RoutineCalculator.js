const RoutineCalculator = (() => {
  const HOURS_IN_SECONDS = 3600;
  const MINUTES_IN_SECONDS = 60;
  const DAYS_IN_WEEK = 7;
  const MS_TO_SECONDS = 1000;
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  function calculateTimestamp(now, dayOffset, routineTime) {
    const date = new Date(now);
    date.setDate(now.getDate() + dayOffset);

    const hours = Math.floor(routineTime / HOURS_IN_SECONDS);
    const minutes = Math.floor(
      (routineTime % HOURS_IN_SECONDS) / MINUTES_IN_SECONDS
    );
    const seconds = routineTime % MINUTES_IN_SECONDS;

    date.setHours(hours, minutes, seconds, 0);
    return Math.floor(date.getTime() / MS_TO_SECONDS);
  }

  function getCurrentTimeData() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime =
      now.getHours() * HOURS_IN_SECONDS +
      now.getMinutes() * MINUTES_IN_SECONDS +
      now.getSeconds();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

    return { now, currentDay, currentTime, todayStart };
  }

  function processSpecificDate(routine, currentTime, todayStart) {
    try {
      const routineDate = new Date(`${routine.frequency}T00:00:00`);

      if (isNaN(routineDate.getTime()))
        return { timestamp: null, shouldDeactivate: false };

      const routineDateStart = routineDate.getTime();
      const daysDiff = (routineDateStart - todayStart) / MS_PER_DAY;
      const hasPassed =
        daysDiff < 0 || (daysDiff === 0 && routine.time <= currentTime);

      if (hasPassed) return { timestamp: null, shouldDeactivate: true };

      const timestamp = calculateTimestamp(routineDate, 0, routine.time);
      return { timestamp, shouldDeactivate: false };
    } catch {
      return { timestamp: null, shouldDeactivate: false };
    }
  }

  function processRecurring(routine, now, currentDay, currentTime) {
    if (routine.frequency.includes(currentDay) && routine.time > currentTime) {
      return calculateTimestamp(now, 0, routine.time);
    }

    for (let day = 1; day <= DAYS_IN_WEEK; day++) {
      const targetDay = (currentDay + day) % DAYS_IN_WEEK;
      if (routine.frequency.includes(targetDay)) {
        return calculateTimestamp(now, day, routine.time);
      }
    }
    return null;
  }

  function processRoutine(routine, timeData) {
    if (!routine.active) return null;

    const { now, currentDay, currentTime, todayStart } = timeData;

    if (typeof routine.frequency === "string") {
      const result = processSpecificDate(routine, currentTime, todayStart);

      if (result.shouldDeactivate) {
        routine.active = false;
        return { timestamp: null, modified: true };
      }
      return { timestamp: result.timestamp, modified: false };
    }

    if (Array.isArray(routine.frequency)) {
      const timestamp = processRecurring(routine, now, currentDay, currentTime);
      return { timestamp, modified: false };
    }

    return null;
  }

  function findNext(routines) {
    if (!routines?.length) return null;

    const timeData = getCurrentTimeData();
    let nextTime = Infinity;
    let nextRoutine = null;
    let routinesModified = false;

    const processedRoutines = routines.forEach(routine => {
      const result = processRoutine(routine, timeData);

      if (result?.modified) routinesModified = true;

      if (result?.timestamp && result.timestamp < nextTime) {
        nextTime = result.timestamp;
        nextRoutine = routine;
      }
    });

    const result = {
      timestamp: nextTime,
      routine: nextRoutine,
      updatedRoutines: routines,
      routinesModified
    };

    return nextRoutine ? result : {};
  }

  return { findNext };
})();
