# 🛍️ 825 SHOP - Discord Ticket Bot

Bot Discord Node.js untuk sistem ticket yang otomatis menjadi testimoni setelah order selesai.

## ✨ Fitur

- **Panel Ticket** dengan banner 825 SHOP
- **Ticket Otomatis** saat user klik tombol
- **Order ID Unik** untuk setiap ticket
- **Notifikasi Staff** saat ticket baru dibuat
- **Tombol Selesaikan Order** untuk staff
- **Auto Testimoni** — setelah order selesai, user diminta testimoni
- **Post Testimoni Otomatis** ke channel testimoni dengan banner & embed cantik
- **Custom Emoji** — bisa diisi emoji server sendiri di `src/config.js`

## 📁 Struktur File

```
discord-bot/
├── src/
│   ├── index.js              # Entry point bot
│   ├── config.js             # ⭐ Konfigurasi & custom emoji
│   ├── banner.png            # Banner 825 SHOP
│   ├── commands/
│   │   ├── panel.js          # Kirim panel ticket
│   │   ├── ticket.js         # Buat ticket baru
│   │   ├── closeTicket.js    # Selesaikan order
│   │   ├── cancelTicket.js   # Batalkan ticket
│   │   └── testimoni.js      # Proses & posting testimoni
│   ├── handlers/
│   │   ├── interactionHandler.js  # Handle tombol
│   │   └── messageHandler.js      # Handle pesan
│   └── utils/
│       └── helpers.js        # Fungsi bantuan
├── .env.example              # Contoh konfigurasi
├── package.json
└── README.md
```

## 🚀 Setup

### 1. Buat Bot Discord

1. Buka [Discord Developer Portal](https://discord.com/developers/applications)
2. Klik **New Application** → beri nama "825 SHOP Bot"
3. Pergi ke **Bot** → klik **Add Bot**
4. Di bagian **Privileged Gateway Intents**, aktifkan:
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**
5. Klik **Reset Token** → salin token

### 2. Invite Bot ke Server

Di bagian **OAuth2 → URL Generator**, pilih:
- Scopes: `bot`
- Bot Permissions:
  - ✅ Manage Channels
  - ✅ Read Messages/View Channels
  - ✅ Send Messages
  - ✅ Embed Links
  - ✅ Attach Files
  - ✅ Read Message History
  - ✅ Manage Messages
  - ✅ Mention Everyone

Buka link URL yang di-generate dan invite bot ke server.

### 3. Konfigurasi .env

```bash
cp .env.example .env
```

Edit file `.env` dan isi semua nilai:

```env
DISCORD_TOKEN=token_bot_kamu
GUILD_ID=id_server_kamu
TICKET_PANEL_CHANNEL_ID=id_channel_panel
TICKET_CATEGORY_ID=id_kategori_ticket
TESTIMONI_CHANNEL_ID=id_channel_testimoni
STAFF_ROLE_ID=id_role_staff
```

**Cara dapat ID Discord:** Aktifkan Developer Mode di Settings → klik kanan channel/role/server → Copy ID

### 4. Install & Jalankan

```bash
# Masuk ke folder bot
cd artifacts/discord-bot

# Install dependencies
npm install
# atau: pnpm install

# Jalankan bot
npm run dev
```

### 5. Kirim Panel Ticket

Di channel yang kamu tentukan sebagai panel channel, ketik:
```
!panel
```

Bot akan mengirim panel dengan banner dan tombol "Buat Ticket".

## ⚙️ Custom Emoji

Edit `src/config.js` bagian `emoji`:

```js
emoji: {
  ticket: "<:tiket825:ID_EMOJI>",    // Ganti dengan emoji server
  close: "<:close825:ID_EMOJI>",
  done: "<:done825:ID_EMOJI>",
  star: "<:star825:ID_EMOJI>",
  // dll...
},
```

**Cara dapat ID custom emoji:**
1. Ketik `\:nama_emoji:` di Discord
2. Salin format lengkapnya: `<:nama_emoji:1234567890>`

## 🔄 Alur Bot

```
User klik "Buat Ticket"
       ↓
Bot buat channel privat (#ticket-username)
       ↓
User & Staff chat di ticket
       ↓
Staff klik "Selesaikan Order"
       ↓
Bot minta testimoni ke user
       ↓
User ketik testimoni
       ↓
Bot posting ke #testimoni dengan banner cantik
       ↓
Channel ticket dihapus otomatis
```

## 🛡️ Permissions

| Aksi | Siapa |
|------|-------|
| Buat ticket | Semua member |
| Lihat ticket | Pemilik ticket + Staff |
| Selesaikan order | Staff + Admin |
| Batalkan ticket | Pemilik ticket + Staff + Admin |
| Kirim panel (!panel) | Admin + Staff |
| Input testimoni | Pemilik ticket (otomatis diminta) |
