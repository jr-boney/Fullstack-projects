import express, { Request, Response } from "express";
import axios from "axios";
import { config } from "dotenv";
import { Telegraf, Context } from "telegraf";

// Load environment variables
config();

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN as string);

console.log("Bot Token:", process.env.BOT_TOKEN);

bot.command("start", (ctx: Context) => {
  ctx.reply("Need motivation? Press /motivate. Use /supp for Ethereum price.");
});

bot.command("supp", async (ctx: Context) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const rate = response.data.ethereum.usd;
    ctx.reply(`Hello, today the Ethereum price is ${rate} USD.`);
  } catch (error) {
    console.error("Error fetching Ethereum price:", error);
    ctx.reply("Sorry, could not fetch Ethereum price right now.");
  }
});

bot.command("jokes", async (ctx: Context) => {
  try {
    const response = await axios.get("https://icanhazdadjoke.com/", {
      headers: { Accept: "application/json" },
    });
    const joke = response.data.joke;
    ctx.reply(`Here's your dad joke: ${joke}`);
  } catch (error) {
    console.error("Error fetching joke:", error);
    ctx.reply("Sorry, could not fetch a joke right now.");
  }
});

bot.on("sticker", (ctx: Context) => ctx.reply("what poppin homies"));

bot.command("motivate", (ctx: Context) => {
  ctx.replyWithAudio({ source: "./Audio/motivation.mp3" });
});

bot.command("hipster", (ctx: Context) => ctx.reply("λ"));

bot.launch().then(() => {
  console.log("Bot launched successfully.");
}).catch((error) => {
  console.error("Failed to launch bot:", error);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Bot is running!");
});
