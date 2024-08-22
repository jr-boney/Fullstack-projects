const express = require('express')
const app = express()
const axios = require('axios');
const path = require('path')
const port = process.env.PORT || 3000;
app.use(express.static('static'))
app.use(express.json());
require('dotenv').config();

const {Telegraf} = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

bot.launch() 


