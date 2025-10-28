import { serve } from "@hono/node-server";
import { makeTownsBot } from "@towns-protocol/bot";
import { Hono } from "hono";
import { logger } from "hono/logger";
import commands from "./commands";

async function main() {
  const bot = await makeTownsBot(
    process.env.APP_PRIVATE_DATA!,
    process.env.JWT_SECRET!,
    {
      commands,
    }
  );

  bot.onSlashCommand("help", async (handler, { channelId }) => {
    await handler.sendMessage(
      channelId,
      `I am Honoré de Balzac. I am here to help you.`
    );
  });

  bot.onSlashCommand("time", async (handler, { channelId }) => {
    const currentTime = new Date().toLocaleString();
    await handler.sendMessage(
      channelId,
      `I am Honoré de Balzac. It's 5:00 somewhere in the world right now.`
    );
  });

  bot.onMessage(async (handler, { message, channelId, eventId, createdAt }) => {
    if (message.toLowerCase().includes("hello")) {
      await handler.sendMessage(channelId, "I am Honoré de Balzac");
    }

    if (message.toLowerCase().includes("help")) {
      await handler.sendMessage(
        channelId,
        "I am Honoré de Balzac. I am here to help you."
      );
    }

    if (message.toLowerCase().includes("ping")) {
      const now = new Date();
      await handler.sendMessage(
        channelId,
        `I am Honoré de Balzac ${now.getTime() - createdAt.getTime()}ms`
      );
    }

    if (message.toLowerCase().includes("react")) {
      await handler.sendMessage(channelId, `I am Honoré de Balzac.`);
    }
  });

  bot.onReaction(async (handler, { reaction, channelId }) => {
    //
  });

  bot.onMessage(async (handler, { channelId, isMentioned }) => {
    if (isMentioned) {
      await handler.sendMessage(channelId, "I am Honoré de Balzac");
    }
  });

  const { jwtMiddleware, handler } = bot.start();

  const app = new Hono();
  app.use(logger());
  app.post("/webhook", jwtMiddleware, handler);

  serve({ fetch: app.fetch, port: parseInt(process.env.PORT!) });
  console.log(
    `✅ Quickstart Bot is running on https://localhost:${process.env.PORT}`
  );
}

main().catch((error) => {
  console.error("Failed to start bot:", error);
  process.exit(1);
});
