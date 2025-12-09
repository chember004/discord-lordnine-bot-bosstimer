import { bosses } from "../data/bosses.js";
import { DateTime } from "luxon";

export function getNextBosses(count = 1) {
  const now = DateTime.now().setZone(process.env.TIMEZONE || "Asia/Manila");

  const bossList = Object.values(bosses).map((b) => {
    let nextTime = null;

    // Daily bosses
    if (b.times) {
      const nextTimes = b.times.map((t) => {
        const [hour, minute] = t.split(":").map(Number);
        let dt = now.set({ hour, minute, second: 0, millisecond: 0 });
        if (dt <= now) dt = dt.plus({ minutes: b.interval });
        return dt;
      });
      nextTime = nextTimes.sort((a, b) => a - b)[0];
    }

    // Weekly bosses
    if (b.schedule) {
      const nextTimes = b.schedule.map((sch) => {
        const [dayStr, timeStr] = sch.split(" ");
        const [hour, minute] = timeStr.split(":").map(Number);
        let dt = now
          .set({ hour, minute, second: 0, millisecond: 0 })
          .set({ weekday: getWeekday(dayStr) });
        if (dt <= now) dt = dt.plus({ weeks: 1 });
        return dt;
      });
      nextTime = nextTime
        ? DateTime.min(nextTime, ...nextTimes)
        : nextTimes.sort((a, b) => a - b)[0];
    }

    return { ...b, nextTime };
  });

  return bossList.sort((a, b) => a.nextTime - b.nextTime).slice(0, count);
}

function getWeekday(day) {
  const map = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };
  return map[day] || 1;
}
