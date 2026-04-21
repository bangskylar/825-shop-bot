// ======================================================
// 825 SHOP - Konfigurasi Bot
// Edit bagian EMOJI sesuai emoji server kamu
// ======================================================

export const config = {
  // ==========================================
  // EMOJI CUSTOM - Isi dengan emoji server kamu
  // Format: <:nama_emoji:ID_emoji> atau emoji biasa
  // ==========================================
  emoji: {
    ticket: "🎫",          // Emoji tombol buat ticket
    close: "🔒",           // Emoji tombol tutup ticket
    done: "<:Sukses:1471044471138553930>",            // Emoji selesai order
    star: "<a:bintang:1463143900242903193>",            // Emoji bintang rating
    shop: "<a:cart:1462332013506728125>",            // Emoji toko
    success: "<:Sukses:1471044471138553930>",         // Emoji sukses
    warning: "⚠️",         // Emoji peringatan
    user: "<:user:1492232108884758548>",            // Emoji user
    order: "<:product:1459116295604666420>",           // Emoji order
    testimoni: "<:feedback:1464247687070093467>",       // Emoji testimoni
    crown: "👑",           // Emoji staff/owner
    // Contoh custom emoji server:
    // star: "<:star825:1234567890123456789>",
    // shop: "<:shop825:1234567890123456789>",
  },

  // ==========================================
  // WARNA EMBED (format hex tanpa #)
  // ==========================================
  colors: {
    main: 0x7c3aed,        // Ungu utama (sesuai banner 825 Shop)
    success: 0x22c55e,     // Hijau sukses
    warning: 0xf59e0b,     // Kuning peringatan
    error: 0xef4444,       // Merah error
    testimoni: 0x8b5cf6,   // Ungu testimoni
    close: 0x6b7280,       // Abu-abu tutup
  },

  // ==========================================
  // TEKS PANEL TICKET
  // ==========================================
  panel: {
    title: "<a:cart:1462332013506728125> 825 SHOP - Ticket System",
    description: [
      "**Selamat datang di 825 SHOP!**",
      "",
      "Klik tombol di bawah untuk membuka ticket pesanan.",
      "Staff kami siap melayani kamu dengan sepenuh hati!",
      "",
      "**<:informasi:1453363177189281832> Cara Order:**",
      "1. Klik tombol **Buat Ticket** di bawah",
      "2. Jelaskan produk yang ingin kamu beli",
      "3. Tunggu staff memproses pesananmu",
      "4. Setelah selesai, ticket akan diubah jadi testimoni",
    ].join("\n"),
    buttonLabel: "Buat Ticket",
    buttonStyle: "Primary",
  },

  // ==========================================
  // TEKS TICKET BARU
  // ==========================================
  ticket: {
    welcomeTitle: "🎫 Ticket Pesanan",
    welcomeDescription: [
      "Halo {user}! Ticket kamu sudah berhasil dibuat.",
      "",
      "**Silahkan jelaskan:**",
      "• Produk apa yang kamu inginkan?",
      "• Berapa jumlah/quantity?",
      "• Ada request khusus?",
      "",
      "Staff kami akan segera melayanimu! 🚀",
    ].join("\n"),
    closeButtonLabel: "Selesaikan Order",
    closeButtonStyle: "Success",
    cancelButtonLabel: "Batalkan Ticket",
    cancelButtonStyle: "Danger",
  },

  // ==========================================
  // TEKS TESTIMONI
  // ==========================================
  testimoni: {
    title: "<:feedback:1464247687070093467> Testimoni Pembeli",
    description: [
      "Order sudah selesai! Silahkan berikan rating dan testimonimu.",
      "",
      "Ketik di bawah dengan format:",
      "```",
      "Rating: ⭐⭐⭐⭐⭐",
      "Produk: [nama produk]",
      "Komentar: [komentar kamu]",
      "```",
      "",
      "Testimonimu sangat berarti untuk kami! 💜",
    ].join("\n"),
    postedTitle: "<a:bintang:1463143900242903193> Testimoni dari {user}",
    postedDescription: [
      "**Pembeli:** {user}",
      "**Tanggal:** {date}",
      "**Order ID:** `{orderId}`",
    ].join("\n"),
    footerText: "825 SHOP • Terpercaya & Terjamin",
  },

  // ==========================================
  // STATUS TOKO (!status command)
  // ==========================================
  shopStatus: {
    // Status toko: true = OPEN, false = CLOSE
    isOpen: true,

    // Teks status embed utama
    title: "825 SHOP",
    description: "Sekarang layanan dan transaksi sudah tersedia, kalian bisa membuat ticket untuk mengambil order di **825 SHOP**",

    // List produk (emoji + nama)
    products: [
      { emoji: "<:Nitro_Ruby:1459116073776451618>", name: "Nitro Basic" },
      { emoji: "<:Nitro_Ruby:1459116073776451618>", name: "Nitro Boost" },
      { emoji: "<a:ruby:1460001493372506317>", name: "Server Boost" },
      { emoji: "<:customer:1464247346542936231>", name: "Bot Discord" },
    ],

    // Staff yang ditampilkan (isi dengan Discord User ID)
    // Format: { label: "Nama", userId: "123456789" }
    staffList: [
      { label: "Owner", userId: "470679249242685462" },
      { label: "Admin", userId: "470679249242685462" },
    ],
  },

  // ==========================================
  // TEKS LAINNYA
  // ==========================================
  messages: {
    ticketCreated: "Ticket berhasil dibuat di {channel}!",
    ticketAlreadyOpen: "Kamu sudah punya ticket yang terbuka! Cek {channel}",
    orderComplete: "Order kamu sudah diselesaikan oleh staff. Silahkan berikan testimonimu!",
    ticketCancelled: "Ticket dibatalkan.",
    onlyStaffCanClose: "Hanya staff yang bisa menutup ticket ini.",
    errorGeneral: "Terjadi error, coba lagi nanti.",
  },
};
