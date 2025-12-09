import { DateTime, Duration } from "luxon";
import { bosses } from "../spawn/bosses.js";

export function getNextBoss() {
  const now = DateTime.now().setZone("Asia/Manila");
  let nextBoss = null;

  Object.values(bosses).forEach((boss) => {
    if (!boss.times && !boss.schedule) return; // skip invalid

    let nextTime;

    // Daily bosses
    if (boss.times) {
      boss.times.forEach((t) => {
        const [hour, minute] = t.split(":").map(Number);
        let candidate = DateTime.fromObject(
          { hour, minute },
          { zone: "Asia/Manila" }
        );

        // Add interval until in future
        const intervalMinutes = parseInt(boss.interval.replace("h", "")) * 60;
        while (candidate < now)
          candidate = candidate.plus({ minutes: intervalMinutes });

        if (!nextTime || candidate < nextTime) nextTime = candidate;
      });
    }

    // Weekly bosses
    if (boss.schedule) {
      boss.schedule.forEach((s) => {
        const [dayStr, timeStr] = s.split(" ");
        const [hour, minute] = timeStr.split(":").map(Number);
        let candidate = DateTime.fromObject(
          { hour, minute },
          { zone: "Asia/Manila" }
        ).set({ weekday: weekdayFromString(dayStr) });

        if (candidate < now) candidate = candidate.plus({ weeks: 1 });

        if (!nextTime || candidate < nextTime) nextTime = candidate;
      });
    }

    if (!nextBoss || nextTime < nextBoss.nextTime) {
      nextBoss = { ...boss, nextTime };
    }
  });

  return nextBoss;
}

export function getNextNBosses(n = 3) {
  const now = DateTime.now().setZone("Asia/Manila");
  const upcoming = [];

  Object.values(bosses).forEach((boss) => {
    if (!boss.times && !boss.schedule) return;

    let nextTime;

    if (boss.times) {
      boss.times.forEach((t) => {
        const [hour, minute] = t.split(":").map(Number);
        let candidate = DateTime.fromObject(
          { hour, minute },
          { zone: "Asia/Manila" }
        );

        const intervalMinutes = parseInt(boss.interval.replace("h", "")) * 60;
        while (candidate < now)
          candidate = candidate.plus({ minutes: intervalMinutes });

        if (!nextTime || candidate < nextTime) nextTime = candidate;
      });
    }

    if (boss.schedule) {
      boss.schedule.forEach((s) => {
        const [dayStr, timeStr] = s.split(" ");
        const [hour, minute] = timeStr.split(":").map(Number);
        let candidate = DateTime.fromObject(
          { hour, minute },
          { zone: "Asia/Manila" }
        ).set({ weekday: weekdayFromString(dayStr) });

        if (candidate < now) candidate = candidate.plus({ weeks: 1 });
        if (!nextTime || candidate < nextTime) nextTime = candidate;
      });
    }

    upcoming.push({ ...boss, nextTime });
  });

  // Sort ascending
  upcoming.sort((a, b) => a.nextTime - b.nextTime);

  return upcoming.slice(0, n);
}

// Helper: map day name to Luxon weekday number
function weekdayFromString(day) {
  const map = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };
  return map[day];
}
