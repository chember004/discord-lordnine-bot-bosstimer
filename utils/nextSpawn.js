import { bosses } from "../data/bosses.js";

export function getNextSpawn() {
  const now = new Date();
  let nextBoss = null;

  for (const key in bosses) {
    const boss = bosses[key];
    const bossTime = boss.times
      ? boss.times.map((t) => {
          const [hours, minutes] = t.split(":").map(Number);
          const nextTime = new Date();
          nextTime.setHours(hours, minutes, 0, 0);
          if (nextTime < now) nextTime.setDate(nextTime.getDate() + 1);
          return nextTime;
        })
      : [];

    const soonestTime = bossTime.length
      ? bossTime.sort((a, b) => a - b)[0]
      : null;

    if (!nextBoss || (soonestTime && soonestTime < nextBoss.nextTime)) {
      nextBoss = { ...boss, nextTime: soonestTime };
    }
  }

  return nextBoss;
}
