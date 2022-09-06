// ! Создать массив инстурментов. Для вывода меню инстурментов использовать @grammyjs/menu => MenuRange
const { Bot } = require("grammy");
require("dotenv").config();
let { mainMenu, skladMenu, addInstrumentMenu } = require("./keyabords");
let { TableInfo } = require("./dataObj");

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);

let tableInfo = new TableInfo();

bot.command("start", async (ctx) => {
  await ctx.reply("Выберите действие, которое желаете совершить:", {
    reply_markup: mainMenu,
  });
  console.log(tableInfo.findObj('Waterfall'))
});

bot.hears("Склад инструментов", (ctx) => {
  ctx.reply(
    `Вы на складе инструментов
Здесь светло и просторно. Вдоль стен рядами стоят стелажи. На полках разложены запакованные инструменты. 

Всего доуступно инструментов:

Название - EN/UA
------------------
${tableInfo.instrumentsInfoStr()}
    `,
    {
      reply_markup: skladMenu,
    }
  );
});

bot.on("callback_query:data", async (ctx) => {
  data = ctx.callbackQuery.data;

  if (data === "add_instrument") {
    ctx.reply(`Какой строй желаете добавить на склад?`, {
      reply_markup: addInstrumentMenu,
    });
  }

  if (data === "inst++") {
    console.log(ctx);
  }
});


bot.start();
