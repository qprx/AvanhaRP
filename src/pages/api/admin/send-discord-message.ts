import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Husk at importere dit prisma-instance

const BOT_TOKEN = "MTM2Mzc5MjExNjYxODM2NzAwNw.G4Ejrh.K3aO4EjccADGrrv_uZJou37DOcWr4OLSZTdmqA";
const GUILD_ID = "1035588340478652457"; // Server ID

const WHITELIST_WEBHOOK = "https://discord.com/api/webhooks/1363792687639167026/eqOYodOOcqhM7D5YRucZvWueZHat4EZDXfogyS8XxsvaeiPMn-4ry9f-uGWQEZ5mUwbg";
const POLITI_WEBHOOK    = "https://discord.com/api/webhooks/1363792689308631251/415UNx24oElT7t6zVUhKHlvvYl-dbeggsz2Pet22azOILPtFyDUrJKbg8M3UZklB4b2E";
const EMS_WEBHOOK       = "https://discord.com/api/webhooks/1363792690998939738/ma79EC_My6Z9TuKSs1EBQdsKB5xxqa9fm8oTD_rSQrOAKdH0CcsWGsZgeGl2KkiwoaI_";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Kun POST er tilladt." });
  }

  const { discordname, newStatus, type } = req.body;

  if (!discordname || !type) {
    return res.status(400).json({ error: "Discord name eller type mangler." });
  }

  try {
    // Find Discord ID til brugeren
    console.log("Discord navn fundet:", discordname);
    const discordId = await getUserIdFromDiscord(discordname);
    console.log("Discord ID fundet:", discordId);

    // Vælg webhook ud fra type
    let webhookUrl;
    switch (type) {
      case "whitelist":
        webhookUrl = WHITELIST_WEBHOOK;
        break;
      case "police":
        webhookUrl = POLITI_WEBHOOK;
        break;
      case "ems":
        webhookUrl = EMS_WEBHOOK;
        break;
      default:
        return res.status(400).json({ error: "Ukendt type." });
    }

    // Bestem farven på embed udfra status
    const embedColor = getColorFromStatus(newStatus);

    // Byg en embed-besked
    const embedMessage = {
      title: "AvanhaRP",
      description: `**Din Angsøning Er** ${newStatus}`,
      color: embedColor, 
      footer: {
        text: "Avanha System", 
      },
      timestamp: new Date().toISOString(),
    };

    // Send beskeden til den valgte kanal via webhook
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `<@${discordId}>`, // Tagger brugeren
        embeds: [embedMessage],
      }),
    });

    return res.status(200).json({ message: "Besked sendt succesfuldt." });
  } catch (error) {
    console.error("Fejl ved behandling af ansøgning:", error);
    return res.status(500).json({ error: "Der skete en fejl." });
  }
}

// Funktion til at hente Discord ID via brugernavn
async function getUserIdFromDiscord(username: string) {
  const url = `https://discord.com/api/v10/guilds/${GUILD_ID}/members/search?query=${username}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
    },
  });

  const data = await response.json();

  if (!response.ok || data.length === 0) {
    throw new Error("Kunne ikke finde Discord bruger.");
  }

  // Her søger vi på username
  const user = data.find((u: any) => u.user.username === username);
  if (!user) {
    throw new Error("Brugeren blev ikke fundet.");
  }

  return user.user.id;
}

// Funktion til at vælge farve baseret på status
function getColorFromStatus(status: string) {
  // Hvis du bruger Hex, skal det konverteres til decimal for Discord embeds.
  // For eksempel: 0x00FF00 (hex for #00FF00) => 65280 (decimal)
  // Men Discord accepterer også, at du bare bruger en hex i 0x-form.
  switch (status.toUpperCase()) {
    case "GODKENDT":
      return 0x00ff00; // Grøn
    case "AFVIST":
      return 0xff0000; // Rød
    default:
      return 0xffffff; // Hvid (eller anden default)
  }
}
