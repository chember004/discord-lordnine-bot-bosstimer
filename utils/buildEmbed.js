export function buildEmbed(nextBoss) {
  if (!nextBoss) {
    return {
      title: `🕒 Next Boss — Unknown`,
      color: 0xff0000,
      fields: [
        { name: "Respawn Time", value: "Unknown", inline: true },
        { name: "Location", value: "Unknown", inline: true },
      ],
      footer: { text: "LordNine Boss Timer" },
    };
  }

  return {
    title: `🕒 Next Boss — ${nextBoss.name}`,
    color: 0x00ff00,
    fields: [
      {
        name: "Respawn Time",
        value: nextBoss.nextTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: process.env.TIME_ZONE,
        }),
        inline: true,
      },
      { name: "Location", value: nextBoss.location, inline: true },
    ],
    footer: { text: "LordNine Boss Timer" },
  };
}
