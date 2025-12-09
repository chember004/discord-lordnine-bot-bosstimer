import { DateTime, Duration } from "luxon";
import { bosses } from "../data/bosses.js";

// Function to get next N bosses to spawn
export function getNextNBosses(n, now = DateTime.now()) {
  const allBosses = Object.values(bosses)
    .filter((b) => b.times || b.schedule)
    .map((b) => {
      let nextTime;

      if (b.times) {
        // Daily bosses
        const bossNextTimes = b.times.map((t) => {
          const [hour, minute] = t.split(":").map(Number);
          let dt = now.set({ hour, minute, second: 0, millisecond: 0 });
          if (dt < now) dt = dt.plus({ days: 1 });
          return dt;
        });
        nextTime = bossNextTimes.sort((a, b) => a - b)[0];
      } else if (b.schedule) {
        // Weekly bosses
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const bossNextTimes = b.schedule.map((s) => {
          const [day, hm] = s.split(" ");
          const [hour, minute] = hm.split(":").map(Number);
          let dt = now.set({ hour, minute, second: 0, millisecond: 0 });
          const targetDay = daysOfWeek.indexOf(day);
          const diff = (targetDay - now.weekday + 7) % 7;
          dt = dt.plus({ days: diff });
          if (dt < now) dt = dt.plus({ days: 7 });
          return dt;
        });
        nextTime = bossNextTimes.sort((a, b) => a - b)[0];
      }

      return {
        name: b.name,
        location: b.location,
        nextTime,
      };
    });

  // Sort all bosses by nextTime ascending
  allBosses.sort((a, b) => a.nextTime - b.nextTime);

  // Return first N bosses
  return allBosses.slice(0, n);
}
