import OpenAI from "openai";

let openaiClient = null;

function getClient() {
  if (!openaiClient) {
    const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
    const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

    if (!baseURL || !apiKey) {
      console.warn("⚠️  AI tidak aktif: env AI_INTEGRATIONS_OPENAI_BASE_URL / AI_INTEGRATIONS_OPENAI_API_KEY belum di-set");
      return null;
    }

    openaiClient = new OpenAI({ baseURL, apiKey });
  }
  return openaiClient;
}

// ─── Fitur 3: Sambutan personal saat ticket dibuka ───────────────────────────
export async function generateWelcomeMessage(username) {
  const client = getClient();
  if (!client) return null;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 200,
      messages: [
        {
          role: "system",
          content: `Kamu adalah asisten toko online 825 SHOP yang ramah, sopan, dan profesional.
Tugas kamu: membuat pesan sambutan singkat dan hangat untuk customer baru yang baru membuka ticket pesanan.
Gunakan bahasa Indonesia yang friendly. Maksimal 3 kalimat. Jangan pakai emoji berlebihan.
Sapa customer dengan namanya, ucapkan terima kasih sudah mau belanja, dan minta mereka jelaskan pesanannya.`,
        },
        {
          role: "user",
          content: `Buat pesan sambutan untuk customer bernama: ${username}`,
        },
      ],
    });

    return response.choices[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error("❌ AI welcome error:", err.message);
    return null;
  }
}

// ─── Fitur 1: Auto-reply pertanyaan customer di ticket ────────────────────────
export async function generateAutoReply(userMessage, username, conversationHistory = []) {
  const client = getClient();
  if (!client) return null;

  try {
    const systemPrompt = `Kamu adalah asisten customer service 825 SHOP yang ramah dan profesional.
Tugasmu membantu customer yang sedang membuka ticket pesanan di Discord.

Info tentang 825 SHOP:
- Toko online yang menjual berbagai produk digital
- Staff siap melayani secepatnya
- Proses order cepat dan terpercaya

Cara menjawab:
- Gunakan bahasa Indonesia yang santai tapi sopan
- Jawab pertanyaan customer dengan informatif
- Jika pertanyaan butuh konfirmasi staff (harga, stok, dll), katakan staff akan segera merespons
- Jangan berikan info harga atau stok yang tidak kamu ketahui
- Maksimal 3-4 kalimat per respons
- Gunakan nama customer (${username}) sesekali agar terasa personal`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-6),
      { role: "user", content: userMessage },
    ];

    const response = await client.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 300,
      messages,
    });

    return response.choices[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error("❌ AI auto-reply error:", err.message);
    return null;
  }
}
