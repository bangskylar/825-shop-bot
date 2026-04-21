import { PermissionFlagsBits } from "discord.js";
import { config } from "../config.js";

export async function cancelTicket(interaction, client) {
  // Langsung acknowledge agar tidak timeout
  await interaction.deferUpdate();

  const member = interaction.member;
  const channel = interaction.channel;
  const staffRoleId = process.env.STAFF_ROLE_ID;

  const isStaff =
    member.permissions.has(PermissionFlagsBits.Administrator) ||
    (staffRoleId && member.roles.cache.has(staffRoleId));

  const ticketState = client.ticketStates.get(channel.id);
  const isOwner = ticketState && member.id === ticketState.userId;

  if (!isStaff && !isOwner) {
    await interaction.followUp({
      content: `${config.emoji.warning} Hanya staff atau pemilik ticket yang bisa membatalkan.`,
      flags: 64,
    });
    return;
  }

  await channel.send({
    content: `${config.emoji.warning} Ticket dibatalkan oleh **${interaction.user.tag}**. Channel akan dihapus dalam 5 detik...`,
  });

  client.ticketStates.delete(channel.id);

  setTimeout(async () => {
    try {
      await channel.delete(`Ticket dibatalkan oleh ${interaction.user.tag}`);
    } catch (err) {
      console.error("Gagal hapus channel:", err.message);
    }
  }, 5000);

  console.log(`🗑️ Ticket ${channel.name} dibatalkan oleh ${interaction.user.tag}`);
}
