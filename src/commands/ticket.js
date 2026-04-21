import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
  AttachmentBuilder,
} from "discord.js";
import { config } from "../config.js";
import { generateOrderId } from "../utils/helpers.js";
import { generateWelcomeMessage } from "../ai.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function createTicket(interaction, client) {
  // Langsung update tanpa defer agar tidak timeout
  await interaction.reply({ content: `${config.emoji.ticket} Membuat ticket...`, flags: 64 });

  const guild = interaction.guild;
  const user = interaction.user;

  // Cek apakah user sudah punya ticket terbuka
  const existingChannel = guild.channels.cache.find(
    (ch) => ch.topic?.includes(user.id) && ch.name.startsWith("ticket-")
  );

  if (existingChannel) {
    await interaction.editReply({
      content: config.messages.ticketAlreadyOpen.replace("{channel}", `<#${existingChannel.id}>`),
    });
    return;
  }

  const categoryId = process.env.TICKET_CATEGORY_ID;
  const category = categoryId ? guild.channels.cache.get(categoryId) : null;
  const orderId = generateOrderId();
  const channelName = `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 20)}`;
  const staffRoleId = process.env.STAFF_ROLE_ID;

  const permissionOverwrites = [
    { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
    {
      id: user.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.AttachFiles,
      ],
    },
  ];

  if (staffRoleId && guild.roles.cache.has(staffRoleId)) {
    permissionOverwrites.push({
      id: staffRoleId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.ManageMessages,
      ],
    });
  }

  const ticketChannel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: category || undefined,
    topic: `Ticket oleh ${user.tag} | ID: ${user.id} | Order: ${orderId}`,
    permissionOverwrites,
  });

  client.ticketStates.set(ticketChannel.id, {
    userId: user.id,
    userTag: user.tag,
    orderId,
    createdAt: new Date(),
    waitingTestimoni: false,
  });

  // Banner
  const bannerUrl = process.env.BANNER_URL;
  let attachment = null;
  let imageUrl = null;
  if (bannerUrl) {
    imageUrl = bannerUrl;
  } else {
    const bannerPath = join(__dirname, "../../src/banner.png");
    const altPath = join(__dirname, "../banner.png");
    const usedPath = fs.existsSync(bannerPath) ? bannerPath : fs.existsSync(altPath) ? altPath : null;
    if (usedPath) {
      attachment = new AttachmentBuilder(usedPath, { name: "banner.png" });
      imageUrl = "attachment://banner.png";
    }
  }

  const welcomeEmbed = new EmbedBuilder()
    .setTitle(`${config.emoji.ticket} ${config.ticket.welcomeTitle} | ${orderId}`)
    .setDescription(config.ticket.welcomeDescription.replace("{user}", `<@${user.id}>`))
    .setColor(config.colors.main)
    .setImage(imageUrl || null)
    .addFields(
      { name: `${config.emoji.user} Pembeli`, value: `<@${user.id}> (${user.tag})`, inline: true },
      { name: `${config.emoji.order} Order ID`, value: `\`${orderId}\``, inline: true },
      { name: `${config.emoji.shop} Dibuat`, value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
    )
    .setFooter({ text: config.testimoni.footerText })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("close_ticket")
      .setLabel(`${config.emoji.done} ${config.ticket.closeButtonLabel}`)
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("cancel_ticket")
      .setLabel(`${config.emoji.warning} ${config.ticket.cancelButtonLabel}`)
      .setStyle(ButtonStyle.Danger)
  );

  const sendOpts = {
    content: `<@${user.id}>${staffRoleId ? ` <@&${staffRoleId}>` : ""}`,
    embeds: [welcomeEmbed],
    components: [row],
  };
  if (attachment) sendOpts.files = [attachment];

  await ticketChannel.send(sendOpts);

  await interaction.editReply({
    content: config.messages.ticketCreated.replace("{channel}", `<#${ticketChannel.id}>`),
  });

  console.log(`🎫 Ticket baru: #${channelName} untuk ${user.tag} (${orderId})`);

  // AI Sambutan Personal (Fitur 3)
  try {
    const aiWelcome = await generateWelcomeMessage(user.displayName || user.username);
    if (aiWelcome) {
      await ticketChannel.sendTyping();
      await new Promise((r) => setTimeout(r, 1500));
      await ticketChannel.send({
        content: `🤖 **Asisten 825 SHOP:**\n${aiWelcome}`,
      });
    }
  } catch (err) {
    console.error("AI welcome gagal:", err.message);
  }
}
