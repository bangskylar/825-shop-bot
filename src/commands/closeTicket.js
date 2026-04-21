import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} from "discord.js";
import { config } from "../config.js";

export async function closeTicket(interaction, client) {
  // Langsung acknowledge tombol agar tidak timeout
  await interaction.deferUpdate();

  const member = interaction.member;
  const channel = interaction.channel;
  const staffRoleId = process.env.STAFF_ROLE_ID;

  const isStaff =
    member.permissions.has(PermissionFlagsBits.Administrator) ||
    (staffRoleId && member.roles.cache.has(staffRoleId));

  if (!isStaff) {
    await interaction.followUp({
      content: `${config.emoji.warning} ${config.messages.onlyStaffCanClose}`,
      flags: 64,
    });
    return;
  }

  const ticketState = client.ticketStates.get(channel.id);
  if (!ticketState) {
    await interaction.followUp({ content: "❌ Ticket state tidak ditemukan.", flags: 64 });
    return;
  }

  client.ticketStates.set(channel.id, {
    ...ticketState,
    waitingTestimoni: true,
    closedBy: interaction.user.tag,
    closedAt: new Date(),
  });

  // Nonaktifkan tombol lama
  await interaction.message.edit({ components: [] }).catch(() => {});

  // Embed selesai + tombol rating bintang 1–5
  const ratingEmbed = new EmbedBuilder()
    .setTitle(`${config.emoji.success} Order Selesai!`)
    .setDescription(
      [
        `Halo <@${ticketState.userId}>! Order kamu sudah diselesaikan oleh **${interaction.user.tag}**.`,
        "",
        `${config.emoji.star} **Berikan rating untuk pesananmu!**`,
        "Pilih jumlah bintang di bawah ini:",
      ].join("\n")
    )
    .setColor(config.colors.success)
    .addFields(
      { name: `${config.emoji.order} Order ID`, value: `\`${ticketState.orderId}\``, inline: true },
      { name: `${config.emoji.crown} Diselesaikan oleh`, value: interaction.user.tag, inline: true }
    )
    .setFooter({ text: config.testimoni.footerText })
    .setTimestamp();

  const ratingRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("rating_1").setLabel("⭐").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("rating_2").setLabel("⭐⭐").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("rating_3").setLabel("⭐⭐⭐").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("rating_4").setLabel("⭐⭐⭐⭐").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("rating_5").setLabel("⭐⭐⭐⭐⭐").setStyle(ButtonStyle.Success)
  );

  await channel.send({
    content: `<@${ticketState.userId}> pilih ratingmu di bawah!`,
    embeds: [ratingEmbed],
    components: [ratingRow],
  });

  console.log(`✅ Ticket ${channel.name} selesai oleh ${interaction.user.tag}, menunggu rating`);
}
