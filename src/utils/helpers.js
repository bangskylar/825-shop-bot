import { randomBytes } from "crypto";

// Generate Order ID unik
export function generateOrderId() {
  const prefix = "825";
  const rand = randomBytes(3).toString("hex").toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `${prefix}-${rand}-${timestamp}`;
}

// Format tanggal ke bahasa Indonesia
export function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
