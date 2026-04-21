import { sendTicketPanel } from "../commands/panel.js";
import { sendStatusEmbed } from "../commands/sendStatus.js";
import { generateAutoReply } from "../ai.js";

// Simpan riwayat percakapan AI per channel: channelId -> [{role, content}]
const aiHistory = new Map();
// Cooldown per user agar tidak spam: userId -> timestamp
const aiCooldown = new Map();
const COOLDOWN_MS = 8000; // 8 detik antar balasan AI

export async function handleMessage(message, client) {
  if (message.author.bot) return;

  // ─── Perintah !status ─────────────────────────────────────────────────────
  if (message.content === "!status") {
    const member = message.member;
    const staffRoleId = process.env.STAFF_ROLE_ID;

    if (
      !member.permissions.has("Administrator") &&
      staffRoleId &&
      !member.roles.cache.has(staffRoleId)
    ) {
      await message.reply("❌ Hanya admin yang bisa menggunakan perintah ini.");
      return;
    }

    await sendStatusEmbed(message.channel, message.guild);
    try {
      await message.delete();
    } catch {}
    return;
  }

  // ─── Perintah !panel ───────────────────────────────────────────────────────
  if (message.content === "!panel") {
    const member = message.member;
    const staffRoleId = process.env.STAFF_ROLE_ID;

    if (
      !member.permissions.has("Administrator") &&
      staffRoleId &&
      !member.roles.cache.has(staffRoleId)
    ) {
      await message.reply("❌ Hanya admin yang bisa menggunakan perintah ini.");
      return;
    }

    await sendTicketPanel(message.channel, client);
    try {
      await message.delete();
    } catch {}
    return;
  }

  // ─── AI Auto-Reply di Ticket (Fitur 1) ────────────────────────────────────
  const channel = message.channel;
  const isTicketChannel = channel.name?.startsWith("ticket-");
  if (!isTicketChannel) return;

  // Jangan balas staff / admin
  const staffRoleId = process.env.STAFF_ROLE_ID;
  const member = message.member;
  const isStaff =
    member?.permissions.has("Administrator") ||
    (staffRoleId && member?.roles.cache.has(staffRoleId));
  if (isStaff) return;

  // Cooldown cek
  const lastReply = aiCooldown.get(message.author.id) || 0;
  if (Date.now() - lastReply < COOLDOWN_MS) return;
  aiCooldown.set(message.author.id, Date.now());

  // Ambil riwayat percakapan channel ini
  const history = aiHistory.get(channel.id) || [];

  try {
    await channel.sendTyping();

    const reply = await generateAutoReply(
      message.content,
      message.author.displayName || message.author.username,
      history
    );

    if (!reply) return;

    // Simpan ke riwayat
    history.push({ role: "user", content: message.content });
    history.push({ role: "assistant", content: reply });
    // Batasi riwayat max 12 pesan terakhir
    if (history.length > 12) history.splice(0, history.length - 12);
    aiHistory.set(channel.id, history);

    await message.reply({
      content: `🤖 **Asisten 825 SHOP:**\n${reply}`,
    });

    console.log(`🤖 AI reply di #${channel.name} untuk ${message.author.tag}`);
  } catch (err) {
    console.error("AI auto-reply gagal:", err.message);
  }
}
