import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { config } from "../config.js";

export async function sendStatusEmbed(channel, guild) {
  const { shopStatus, colors, emoji, testimoni } = config;
  const isOpen = shopStatus.isOpen;
  const statusText = isOpen ? "OPEN 🟢" : "CLOSE 🔴";
  const statusColor = isOpen ? 0x23272a : 0x23272a; // warna gelap netral seperti di gambar
  const guildIcon = guild.iconURL({ dynamic: true }) || undefined;

  // ─── Embed 1: Status Toko ────────────────────────────────────────────────
  const statusEmbed = new EmbedBuilder()
    .setTitle(`${shopStatus.title} | ${statusText}`)
    .setDescription(shopStatus.description)
    .setColor(statusColor)
    .setThumbnail(guildIcon || null)
    .setFooter({ text: testimoni.footerText });

  // ─── Embed 2: List Produk ────────────────────────────────────────────────
  const productList = shopStatus.products
    .map((p) => `${p.emoji} ${p.name}`)
    .join("\n");

  const productEmbed = new EmbedBuilder()
    .setTitle(`${emoji.shop} LIST PRODUCT`)
    .setDescription(productList)
    .setColor(statusColor);

  // ─── Embed 3: Support Staff ──────────────────────────────────────────────
  const staffEmbed = new EmbedBuilder()
    .setTitle(`${emoji.crown} SUPPORT STAFF`)
    .setColor(statusColor);

  const validStaff = shopStatus.staffList.filter((s) => s.userId);
  if (validStaff.length > 0) {
    staffEmbed.setDescription(
      validStaff.map((s) => `<@${s.userId}>`).join("  •  ")
    );
  } else {
    staffEmbed.setDescription(
      "_Isi `staffList` di config.js dengan User ID staff kamu_"
    );
  }

  // ─── Row 1: Tombol Buat Ticket ───────────────────────────────────────────
  const ticketRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("create_ticket")
      .setLabel(`${emoji.ticket} Buat Ticket`)
      .setStyle(ButtonStyle.Primary)
  );

  // ─── Row 2: Tombol Staff (URL link) ─────────────────────────────────────
  const rows = [ticketRow];

  if (validStaff.length > 0) {
    const staffButtons = validStaff.slice(0, 5).map((s) =>
      new ButtonBuilder()
        .setLabel(s.label)
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/users/${s.userId}`)
    );
    rows.push(new ActionRowBuilder().addComponents(...staffButtons));
  }

  // ─── Kirim 1 pesan dengan semua embed + semua tombol ────────────────────
  await channel.send({
    content: "@everyone",
    embeds: [statusEmbed, productEmbed, staffEmbed],
    components: rows,
  });

  console.log(`📢 Status embed dikirim ke #${channel.name}`);
}
