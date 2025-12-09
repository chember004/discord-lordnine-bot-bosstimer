// utils/buildEmbed.js
export function buildEmbed(nextBoss) {
  if (!nextBoss || !nextBoss.nextTime) {
    return {
      title: `🕒 Next Boss — ${nextBoss?.name ?? "Unknown"}`,
      color: 0xff0000,
      fields: [
        { name: "Respawn Time", value: "Unknown", inline: true },
        {
          name: "Location",
          value: nextBoss?.location ?? "Unknown",
          inline: true,
        },
      ],
      footer: { text: "LordNine Boss Timer" },
    };
  }

  const countdown = Math.floor((nextBoss.nextTime - new Date()) / 1000);
  const hours = Math.floor(countdown / 3600);
  const minutes = Math.floor((countdown % 3600) / 60);
  const seconds = countdown % 60;
  const countdownStr = `${hours}h ${minutes}m ${seconds}s`;

  return {
    title: `🕒 Next Boss — ${nextBoss.name}`,
    color: 0x00ff00,
    fields: [
      {
        name: "Respawn Time",
        value: nextBoss.nextTime.toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        inline: true,
      },
      {
        name: "Location",
        value: nextBoss.location,
        inline: true,
      },
      {
        name: "Countdown",
        value: countdownStr,
        inline: true,
      },
    ],
    footer: { text: "LordNine Boss Timer" },
  };
}
