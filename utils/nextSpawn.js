export function getNextSpawn(bosses) {
  const now = new Date();

  // Flatten bosses to a list with next spawn time
  const allBosses = Object.values(bosses).map((boss) => {
    let nextTime = null;

    if (boss.times) {
      nextTime = boss.times
        .map((t) => {
          const [hour, minute] = t.split(":").map(Number);
          const dt = new Date(now);
          dt.setHours(hour, minute, 0, 0);
          if (dt < now) dt.setDate(dt.getDate() + 1);
          return dt;
        })
        .sort((a, b) => a - b)[0];
    }

    return { ...boss, nextTime };
  });

  // Pick the closest next spawn
  allBosses.sort((a, b) => {
    if (!a.nextTime) return 1;
    if (!b.nextTime) return -1;
    return a.nextTime - b.nextTime;
  });

  return allBosses[0];
}
