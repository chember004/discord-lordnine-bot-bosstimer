import { DateTime, Duration } from "luxon";
import { bosses } from "../data/bosses.js"; // corrected path

const TIMEZONE = process.env.TIMEZONE || "Asia/Manila";

/**
 * Convert interval string to minutes
 * e.g., "62h" => 62 * 60
 */
function intervalToMinutes(interval) {
  if (!interval) return null;
  const match = interval.match(/(\d+)(h|m)/);
  if (!match) return null;
  const [, value, unit] = match;
  return unit === "h" ? parseInt(value) * 60 : parseInt(value);
}

/**
 * Get next spawn time for a single boss
 */
export function getNextBossTime(boss) {
  const now = DateTime.now().setZone(TIMEZONE);

  // For daily bosses with times
  if (boss.times && boss.times.length > 0) {
    const times = boss.times.map((t) => {
      const [hour, minute] = t.split(":").map(Number);
      let dt = now.set({ hour, minute, second: 0, millisecond: 0 });
      if (dt < now) dt = dt.plus({ days: 1 });
      return dt;
    });
    times.sort((a, b) => a - b);
    return times[0];
  }

  // For bosses with interval
  if (boss.interval && boss.lastTime) {
    const last = DateTime.fromISO(boss.lastTime, { zone: TIMEZONE });
    const minutes = intervalToMinutes(boss.interval);
    if (!minutes) return null;
    let next = last.plus({ minutes });
    while (next < now) {
      next = next.plus({ minutes });
    }
    return next;
  }

  return null;
}

/**
 * Get next N upcoming bosses, sorted by next spawn
 */
export function getNextNBosses(n = 1) {
  const bossArray = Object.values(bosses).filter(
    (b) => b.times || (b.interval && b.lastTime)
  );

  const bossesWithNext = bossArray.map((b) => {
    const nextTime = getNextBossTime(b);
    return { ...b, nextTime };
  });

  bossesWithNext.sort((a, b) => a.nextTime - b.nextTime);

  return bossesWithNext.slice(0, n);
}

/**
 * Format DateTime to display with AM/PM
 */
export function formatDateTime(dt) {
  return dt.toFormat("yyyy-MM-dd hh:mm a");
}

/**
 * Format countdown as HH:MM:SS or D HH:MM:SS
 */
export function formatCountdown(dt) {
  const now = DateTime.now().setZone(TIMEZONE);
  let diff = dt.diff(now, ["days", "hours", "minutes", "seconds"]).toObject();
  let str = "";
  if (diff.days >= 1) str += `${Math.floor(diff.days)}d `;
  str += `${String(Math.floor(diff.hours)).padStart(2, "0")}:`;
  str += `${String(Math.floor(diff.minutes)).padStart(2, "0")}:`;
  str += `${String(Math.floor(diff.seconds)).padStart(2, "0")}`;
  return str;
}
