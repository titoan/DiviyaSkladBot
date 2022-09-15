// ! Создать массив инстурментов. Для вывода меню инстурментов использовать @grammyjs/menu => MenuRange
const { Bot, session } = require("grammy");
require("dotenv").config();
let {
  mainMenu,
  skladMenu,
  materialMenu,
  addInstrumentMenu,
  chooseRegion,
  writeTable
} = require("./keyabords");
let { TableInfo } = require("./dataObj");

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);

let tableInfo = new TableInfo();

function initial() {
  return {
    addInstrument: false,
    count: 0,
    instrument: {},
    region: "",
    prevMsgId: 0,
  };
}

bot.use(session({ initial }));

bot.command("start", async (ctx) => {
  await ctx.reply(
    `Вы находитесь в мастерской. Вероятно, вы здесь не просто так и у вас на сегодняшний день запланирована масса разнообразнейших задач.

Юху-ху-ху! Ну так скорее же вперед на рандеву с производительным трудом!

Ну так и чем займемся?`,
    {
      reply_markup: mainMenu,
    }
  );

});

bot.hears("Склад инструментов", (ctx) => {
  ctx.reply(
    `Вы на складе инструментов
Здесь светло и просторно. Вдоль стен рядами стоят стелажи. На полках разложены запакованные инструменты. 

Всего доступно инструментов:

Название - ENG/UA
——————————
${tableInfo.instrumentsInfoStr()}
    `,
    {
      reply_markup: skladMenu,
    }
  );
});

bot.hears("Склад материалов", ctx=>{
  ctx.reply(`Вы на складе инструментов
Здесь светло и просторно. Вдоль стен рядами стоят стелажи. На полках разложены готовые к сборке материалы. 
  
Всего доступно материалов:
——————————
${tableInfo.componentsInfoStr()}`,{reply_markup: materialMenu}); 
})

bot.on("callback_query:data", async (ctx) => {
  data = ctx.callbackQuery.data;

  if (data === "add_instrument") {
    bot.api.deleteMessage(ctx.chat.id,ctx.update.callback_query.message.message_id);
    ctx.session.addInstrument = true;
    ctx.reply(`🪗 Какой строй желаете добавить на склад? 🪗`, {
      reply_markup: addInstrumentMenu,
    });
  }

  let addInstrument_Query = `${data}`.match(/add__(.+)/g);
  if (data == addInstrument_Query) {
    data = data.match(/[A-Z].*/g);
    bot.api.deleteMessage(ctx.chat.id,ctx.update.callback_query.message.message_id);
    ctx.session.instrument = tableInfo.findInstrument(data);
    ctx.reply(
      `Вы выбрали <b>${ctx.session.instrument["Инструменты"]}</b>
    
      К какому региону отностися инструмент?`,
      {
        reply_markup: chooseRegion,
        parse_mode: "HTML",
      }
    );
  }

  if (data === "ENG" || data === "UA") {
    ctx.session.region = data;
    bot.api.deleteMessage(ctx.chat.id,ctx.update.callback_query.message.message_id);

    bot.api.sendMessage(ctx.chat.id,
`Вы выбрали <b>${ctx.session.instrument["Инструменты"]}</b>
Регион: <b>${ctx.session.region}</b>
        
Сколько инстурментов желаете добавить?`,{parse_mode:"HTML"});
  }

  if(data === "write_to_table"){
    tableInfo.addToTable();
    ctx.reply(`Результат ваших непосильных усилй записан в таблицу в виде целочисленного значения.

Надеюсь, данный ряд совершённых действий имеет за собой не только некоторого рода завпечетленный факт условных показателей производительности, но и удовольствие
    `, {reply_markup:mainMenu})
  }
});

bot.hears(/[0-9]/, (ctx) => {
  if (ctx.session.addInstrument) {
    let region = `В наличии ${ctx.session.region}`;

    let total = [parseInt(ctx.session.instrument[region]), parseInt(ctx.message.text)].reduce((prev, curr) => prev + curr);
    ctx.session.instrument[`В наличии ${ctx.session.region}`] = total;

    ctx.reply(
      `На склад было добавлено ${ctx.message.text} инструментов ${ctx.session.instrument["Инструменты"]}`,{reply_markup:writeTable}
    );
    ctx.session.addInstrument = false;
  }
});

bot.start();
