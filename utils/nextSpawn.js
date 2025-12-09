// utils/nextSpawn.js
import { DateTime, Duration } from "luxon";
import { bosses } from "../data/bosses.js";

/**
 * Convert interval string like "62h" or "24h" into milliseconds
 */
function parseInterval(interval) {
  if (!interval) return null;
  const match = interval.match(/(\d+)([h|m])/i);
  if (!match) return null;
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  return unit === "h" ? value * 60 * 60 * 1000 : value * 60 * 1000;
}

/**
 * Get next spawn time for a daily boss
 */
function getNextDailyBoss(boss, now, timeZone) {
  const lastTime = DateTime.fromFormat(boss.times[0], "HH:mm", {
    zone: timeZone,
  }).set({
    year: now.year,
    month: now.month,
    day: now.day,
  });

  const intervalMs = parseInterval(boss.interval);
  if (!intervalMs) return null;

  let next = lastTime;
  while (next <= now) {
    next = next.plus({ milliseconds: intervalMs });
  }
  return next;
}

/**
 * Get next spawn time for a weekly boss
 */
function getNextWeeklyBoss(boss, now, timeZone) {
  if (!boss.schedule || boss.schedule.length === 0) return null;

  const weekdays = {
    Sunday: 7,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  let nextTimes = boss.schedule.map((sched) => {
    const [day, time] = sched.split(" ");
    const [hour, minute] = time.split(":").map(Number);
    let next = DateTime.now().setZone(timeZone).startOf("day");
    const targetWeekday = weekdays[day];
    const currentWeekday = next.weekday;
    let daysToAdd = (targetWeekday - currentWeekday + 7) % 7;
    if (
      daysToAdd === 0 &&
      (hour < next.hour || (hour === next.hour && minute <= next.minute))
    ) {
      daysToAdd = 7; // if today passed the time, go to next week
    }
    return next.plus({ days: daysToAdd, hours: hour, minutes: minute });
  });

  nextTimes.sort((a, b) => a - b);
  return nextTimes[0];
}

/**
 * Get the next spawn for a boss
 */
export function getNextBoss(boss, now, timeZone) {
  if (!boss) return null;
  const isWeekly = !!boss.schedule;
  return isWeekly
    ? getNextWeeklyBoss(boss, now, timeZone)
    : getNextDailyBoss(boss, now, timeZone);
}

/**
 * Get the upcoming N bosses sorted by next spawn time
 */
export function getNextNBosses(n = 1, timeZone = "UTC") {
  const now = DateTime.now().setZone(timeZone);

  const upcoming = Object.values(bosses)
    .map((boss) => {
      const nextTime = getNextBoss(boss, now, timeZone);
      return nextTime ? { ...boss, nextTime } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.nextTime - b.nextTime);

  return upcoming.slice(0, n);
}

/**
 * Get the single next boss (for /boss command)
 */
export function getNextBossSingle(timeZone = "UTC") {
  return getNextNBosses(1, timeZone)[0] || null;
}
