import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
} from "discord.js";
import { config } from "../config.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function sendTicketPanel(channel, client) {
  // Gunakan banner URL dari env atau file lokal
  const bannerUrl = process.env.BANNER_URL;
  let attachment = null;
  let imageUrl = null;

  if (bannerUrl) {
    imageUrl = bannerUrl;
  } else {
    // Coba gunakan file banner lokal
    const bannerPath = join(__dirname, "../../src/banner.png");
    const altPath = join(__dirname, "../banner.png");
    const usedPath = fs.existsSync(bannerPath) ? bannerPath : fs.existsSync(altPath) ? altPath : null;
    if (usedPath) {
      attachment = new AttachmentBuilder(usedPath, { name: "banner.png" });
      imageUrl = "attachment://banner.png";
    }
  }

  const embed = new EmbedBuilder()
    .setTitle(config.panel.title)
    .setDescription(config.panel.description)
    .setColor(config.colors.main)
    .setImage(imageUrl || null)
    .setFooter({
      text: config.testimoni.footerText,
      iconURL: channel.guild.iconURL() || undefined,
    })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("create_ticket")
      .setLabel(`${config.emoji.ticket} ${config.panel.buttonLabel}`)
      .setStyle(ButtonStyle.Primary)
  );

  const sendOptions = { embeds: [embed], components: [row] };
  if (attachment) sendOptions.files = [attachment];

  await channel.send(sendOptions);
  console.log(`✅ Panel ticket dikirim ke #${channel.name}`);
}
