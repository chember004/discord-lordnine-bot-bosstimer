import { bosses } from "../data/bosses.js";

export function getNextBoss() {
  const now = new Date();
  let nextBoss = null;
  let nextTime = null;

  for (const key in bosses) {
    const boss = bosses[key];
    // calculate next spawn time
    for (const time of boss.times) {
      const [hourStr, minStr] = time.split(":");
      let bossTime = new Date(now);
      bossTime.setHours(parseInt(hourStr), parseInt(minStr), 0, 0);

      if (bossTime < now) {
        bossTime.setDate(bossTime.getDate() + 1); // next day
      }

      if (!nextTime || bossTime < nextTime) {
        nextTime = bossTime;
        nextBoss = { ...boss, nextTime: bossTime };
      }
    }
  }

  return nextBoss;
}
