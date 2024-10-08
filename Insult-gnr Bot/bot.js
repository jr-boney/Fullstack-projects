const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");
const port = process.env.PORT || 3000;

app.use(express.static("static"));
app.use(express.json());
require("dotenv").config();

const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const { message } = require("telegraf/filters");

bot.command("start", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Need motivation press /motivate . Use /supp for ethereum price.",
    {}
  );
});

bot.command("supp", (ctx) => {
  console.log(ctx.from);
  axios
    .get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
    )
    .then((response) => {
      console.log(response.data);
      const rate = response.data.ethereum.usd;
      const message = `Hello, today the Ethereum price is ${rate} USD.`;
      bot.telegram.sendMessage(ctx.chat.id, message, {});
    })
    .catch((error) => {
      console.error("Error fetching Ethereum price:", error);
      bot.telegram.sendMessage(
        ctx.chat.id,
        "Sorry, could not fetch Ethereum price right now.",
        {}
      );
    });
});

bot.command("jokes", async (ctx) => {
  try {
    const response = await axios.get("https://icanhazdadjoke.com/", {
      headers: { Accept: "application/json" },
    });
    console.log(response.data.joke);
    const joke = response.data.joke;

    const message = `Here's your dad joke: ${joke}`;

    await bot.telegram.sendMessage(ctx.chat.id, message, {});
  } catch (error) {
    console.error("Error fetching joke:", error);
    await bot.telegram.sendMessage(
      ctx.chat.id,
      "Sorry, could not fetch a joke right now.",
      {}
    );
  }
});
bot.on(message("sticker"), (ctx) => ctx.reply("what poppin homies"));

bot.command("motivate", (ctx) => {
  ctx.replyWithAudio({ source: "./Audio/motivation.mp3" });
});
bot.command("hipster", Telegraf.reply("λ"));

bot.launch();
