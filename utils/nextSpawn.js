import { DateTime, Duration } from "luxon";
import { bosses } from "../data/bosses.js";

const TIMEZONE = process.env.TIMEZONE || "Asia/Manila";

function parseTime(timeStr) {
  const [hour, minute] = timeStr.split(":").map(Number);
  return { hour, minute };
}

function getNextTimeForBoss(boss) {
  const now = DateTime.now().setZone(TIMEZONE);
  const nextTimes = boss.times.map((t) => {
    const { hour, minute } = parseTime(t);
    let dt = now.set({ hour, minute, second: 0, millisecond: 0 });
    if (dt < now) dt = dt.plus({ days: 1 });
    return dt;
  });
  return nextTimes.sort((a, b) => a - b)[0];
}

export function getNextBoss() {
  const now = DateTime.now().setZone(TIMEZONE);
  let next = null;

  Object.values(bosses).forEach((b) => {
    if (!b.times) return; // skip weekly if no times
    const spawnTime = getNextTimeForBoss(b);
    if (!next || spawnTime < next.nextTime) {
      next = { ...b, nextTime: spawnTime };
    }
  });

  return next;
}

export function getNextNBosses(n = 3) {
  const now = DateTime.now().setZone(TIMEZONE);
  const bossList = Object.values(bosses)
    .filter((b) => b.times)
    .map((b) => ({ ...b, nextTime: getNextTimeForBoss(b) }))
    .sort((a, b) => a.nextTime - b.nextTime);

  return bossList.slice(0, n);
}
