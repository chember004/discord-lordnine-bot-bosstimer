import { bosses } from "../data/bosses.js";
import moment from "moment-timezone";

const TIMEZONE = process.env.TIMEZONE || "Asia/Manila";

function parseTime(timeStr) {
  return moment.tz(timeStr, "HH:mm", TIMEZONE);
}

export function getNextBoss() {
  let next = null;
  const now = moment().tz(TIMEZONE);

  for (const key in bosses) {
    const boss = bosses[key];
    const times = boss.times || [];

    times.forEach((t) => {
      const bossTime = parseTime(t);
      if (!next || bossTime.isBefore(next.time)) {
        next = { ...boss, nextTime: bossTime.toDate(), time: bossTime };
      }
    });
  }

  return next;
}

export function getNextNBosses(count) {
  const now = moment().tz(TIMEZONE);
  const list = [];

  for (const key in bosses) {
    const boss = bosses[key];
    const times = boss.times || [];
    times.forEach((t) => {
      const bossTime = parseTime(t);
      if (bossTime.isAfter(now)) {
        list.push({ ...boss, nextTime: bossTime.toDate() });
      }
    });
  }

  // Sort ascending by next spawn
  list.sort((a, b) => a.nextTime - b.nextTime);

  return list.slice(0, count);
}
