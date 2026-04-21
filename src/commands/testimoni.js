import { EmbedBuilder } from "discord.js";
import { config } from "../config.js";

const STAR_LABELS = {
  1: "<a:bintang:1463143900242903193> — Kurang Memuaskan",
  2: "<a:bintang:1463143900242903193><a:bintang:1463143900242903193> — Cukup",
  3: "<a:bintang:1463143900242903193><a:bintang:1463143900242903193><a:bintang:1463143900242903193> — Lumayan",
  4: "<a:bintang:1463143900242903193><a:bintang:1463143900242903193><a:bintang:1463143900242903193><a:bintang:1463143900242903193> — Bagus",
  5: "<a:bintang:1463143900242903193><a:bintang:1463143900242903193><a:bintang:1463143900242903193><a:bintang:1463143900242903193><a:bintang:1463143900242903193> — Sangat Memuaskan!",
};

export async function handleRatingButton(interaction, client) {
  // Acknowledge segera agar tidak timeout
  await interaction.deferUpdate();

  const channel = interaction.channel;
  const ticketState = client.ticketStates.get(channel.id);

  if (!ticketState) return;

  // Hanya pemilik ticket yang bisa memberi rating
  if (interaction.user.id !== ticketState.userId) {
    await interaction.followUp({
      content: `${config.emoji.warning} Hanya pemilik ticket yang bisa memberi rating.`,
      flags: 64,
    });
    return;
  }

  const stars = parseInt(interaction.customId.split("_")[1]);
  const starLabel = STAR_LABELS[stars] || "⭐⭐⭐⭐⭐";

  const testimoniChannelId = process.env.TESTIMONI_CHANNEL_ID;
  if (!testimoniChannelId) {
    console.warn("⚠️ TESTIMONI_CHANNEL_ID belum diset");
    await channel.send("⚠️ Config TESTIMONI_CHANNEL_ID belum diisi, hubungi admin.");
    return;
  }

  const testimoniChannel = interaction.guild.channels.cache.get(testimoniChannelId);
  if (!testimoniChannel) {
    console.warn("⚠️ Channel testimoni tidak ditemukan");
    return;
  }

  const user = interaction.user;
  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Embed testimoni: foto profil customer, TANPA banner
  const testimoniEmbed = new EmbedBuilder()
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL({ dynamic: true, size: 128 }),
    })
    .setTitle(`${config.emoji.star} Testimoni Pembeli`)
    .setDescription(
      [
        `**Pembeli:** <@${user.id}>`,
        `**Order ID:** \`${ticketState.orderId}\``,
        `**Tanggal:** ${dateStr}`,
        "",
        `**Rating:**`,
        `> ${starLabel}`,
      ].join("\n")
    )
    .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
    .setColor(config.colors.testimoni)
    .setFooter({ text: config.testimoni.footerText })
    .setTimestamp();

  await testimoniChannel.send({ embeds: [testimoniEmbed] });

  // Nonaktifkan tombol rating
  await interaction.message.edit({ components: [] }).catch(() => {});

  // Konfirmasi di ticket
  await channel.send({
    content: `${config.emoji.success} Terima kasih ratingnya <@${user.id}>! **${starLabel}**\nTicket akan ditutup dalam 10 detik...`,
  });

  client.ticketStates.delete(channel.id);

  setTimeout(async () => {
    try {
      await channel.delete(`Testimoni selesai dari ${user.tag}`);
    } catch (err) {
      console.error("Gagal hapus channel:", err.message);
    }
  }, 10000);

  console.log(`📝 Rating ${stars}<a:bintang:1463143900242903193> dari ${user.tag} → #${testimoniChannel.name}`);
}
