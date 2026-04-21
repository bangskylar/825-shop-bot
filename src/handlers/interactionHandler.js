import { createTicket } from "../commands/ticket.js";
import { closeTicket } from "../commands/closeTicket.js";
import { cancelTicket } from "../commands/cancelTicket.js";
import { handleRatingButton } from "../commands/testimoni.js";

export async function handleInteraction(interaction, client) {
  try {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    if (customId === "create_ticket") {
      await createTicket(interaction, client);
    } else if (customId === "close_ticket") {
      await closeTicket(interaction, client);
    } else if (customId === "cancel_ticket") {
      await cancelTicket(interaction, client);
    } else if (customId.startsWith("rating_")) {
      await handleRatingButton(interaction, client);
    }
  } catch (error) {
    console.error("Error handling interaction:", error);
    try {
      const reply = { content: "❌ Terjadi error, coba lagi.", flags: 64 };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    } catch {}
  }
}
