import http from "http";

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", bot: "825 SHOP", message: "Bot aktif!" }));
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.warn(`⚠️  Port ${PORT} sudah dipakai, web server dilewati.`);
  } else {
    console.error("Web server error:", err.message);
  }
});

server.listen(PORT, () => {
  console.log(`🌐 Web server aktif di port ${PORT}`);
  console.log(`   → Daftarkan URL ini ke UptimeRobot untuk monitoring`);
});

const PING_INTERVAL_MS = 5 * 60 * 1000;

function buildPingUrl() {
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "");
  if (process.env.API_URL) return process.env.API_URL.replace(/\/$/, "");
  return `http://localhost:${PORT}`;
}

async function pingHealth() {
  const url = buildPingUrl();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) { console.warn(`⚠️  Self-ping non-2xx: HTTP ${res.status}`); return; }
    console.log(`🏓 Self-ping OK — ${url}`);
  } catch (err) {
    console.warn(`⚠️  Self-ping gagal: ${err.message}`);
  }
}

setTimeout(() => {
  pingHealth();
  setInterval(pingHealth, PING_INTERVAL_MS);
}, 60000);
