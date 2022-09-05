// ! Создать массив инстурментов. Для вывода меню инстурментов использовать @grammyjs/menu => MenuRange
const { Bot } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
require('dotenv').config();
let {mainMenu} = require('./keyabords');
let {TableInfo} = require('./dataObj');

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);

let tableInfo = new TableInfo();

bot.command("start", async (ctx) => {  
    await ctx.reply("Выберите действие, которое желаете совершить:", { reply_markup: mainMenu});
  });

  bot.hears("Склад инструментов", ctx=>{   
    ctx.reply(`Вы на складе инструментов

Всего доуступно инструментов:

Название - EN/UA
------------------
${tableInfo.instrumentsInfoStr()}
    `)
  })

  bot.start();