import "./keep_alive.js";
import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  Events,
} from "discord.js";
import { handleInteraction } from "./handlers/interactionHandler.js";
import { handleMessage } from "./handlers/messageHandler.js";
import { sendTicketPanel } from "./commands/panel.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
});

// Simpan state ticket yang menunggu testimoni
client.ticketStates = new Collection();
// Map: channelId -> { userId, orderId, createdAt }

client.once(Events.ClientReady, async (c) => {
  console.log(`✅ Bot siap! Login sebagai ${c.user.tag}`);
  console.log(`📡 Terhubung ke ${c.guilds.cache.size} server`);
  console.log("");
  console.log("🛍️  825 SHOP Ticket Bot aktif!");
  console.log("─────────────────────────────────────────");
  console.log("Perintah tersedia:");
  console.log("  !panel   → kirim panel ticket");
  console.log("  !status  → kirim embed status toko + produk + staff");
  console.log("─────────────────────────────────────────");
});

// Handle interaksi (button, modal, select menu)
client.on(Events.InteractionCreate, async (interaction) => {
  await handleInteraction(interaction, client);
});

// Handle pesan (prefix command + testimoni input)
client.on(Events.MessageCreate, async (message) => {
  await handleMessage(message, client);
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("❌ ERROR: DISCORD_TOKEN tidak ditemukan!");
  console.error("   Salin .env.example menjadi .env dan isi DISCORD_TOKEN");
  process.exit(1);
}

client.login(token).catch((err) => {
  if (err.message.includes("disallowed intents")) {
    console.error("❌ ivileged Intents belum diaktifkan!");
    console.error("");
    console.error("🔧 Cara fix:");
    console.error("   1. Buka https://discord.com/developers/applications");
    console.error("   2. Pilih aplikasi bot kamu");
    console.error("   3. Klik menu 'Bot' di sidebar kiri");
    console.error("   4. Scroll ke 'Privileged Gateway Intents'");
    console.error("   5. Aktifkan: ✅ SERVER MEMBERS INTENT");
    console.error("               ✅ MESSAGE CONTENT INTENT");
    console.error("   6. Klik 'Save Changes'");
    console.error("   7. Restart bot ini");
  } else if (
    err.message.includes("TOKEN_INVALID") ||
    err.message.includes("invalid token")
  ) {
    console.error("❌ ERROR: Token bot tidak valid!");
    console.error("   Pastikan DISCORD_TOKEN di secrets sudah benar.");
  } else {
    console.error("❌ Gagal login:", err.message);
  }
  process.exit(1);
});
