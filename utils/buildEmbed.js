export function buildEmbed(boss) {
  if (!boss || !boss.nextTime) {
    return {
      title: `🕒 Next Boss — ${boss?.name ?? "Unknown"}`,
      color: 0xff0000,
      fields: [
        { name: "Respawn Time", value: "Unknown", inline: true },
        { name: "Location", value: boss?.location ?? "Unknown", inline: true },
      ],
      footer: { text: "LordNine Boss Timer" },
    };
  }

  return {
    title: `🕒 Next Boss — ${boss.name}`,
    color: 0x00ff00,
    fields: [
      {
        name: "Respawn Time",
        value: boss.nextTime.toFormat("HH:mm"),
        inline: true,
      },
      {
        name: "Location",
        value: boss.location,
        inline: true,
      },
    ],
    footer: { text: "LordNine Boss Timer" },
  };
}
