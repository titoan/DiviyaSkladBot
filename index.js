// ! Создать массив инстурментов. Для вывода меню инстурментов использовать @grammyjs/menu => MenuRange
const { Bot, session } = require("grammy");
require("dotenv").config();
let {
  mainMenu,
  skladMenu,
  addInstrumentMenu
} = require("./keyabords");
let { TableInfo } = require("./dataObj");
// let { TableInfo, getAddInstrument } = require("./dataObj");

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);

let tableInfo = new TableInfo();

function initial() {
  return { 
    addInstrument: false,
    count: 0,
    instrument: {}
   };
}

bot.use(session({ initial }));

bot.command("start", async (ctx) => {
  await ctx.reply("Выберите действие, которое желаете совершить:", {
    reply_markup: mainMenu,
  });
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
    ctx.session.addInstrument = true;
    ctx.reply(`Какой строй желаете добавить на склад?`, {
      reply_markup: addInstrumentMenu,
    });
  }

  let regexp = `${data}`.match(/add__(.+)/g);
  if (data == regexp) {
    data = data.match(/[A-Z].*/g);
    ctx.session.instrument = tableInfo.findInstrument(data);

    ctx.reply(
      `Вы выбрали <b>${ctx.session.instrument["Инструменты"]}</b>
Сколько инстурментов желаете добавить?`,
      { parse_mode: "HTML" }
    );
  }
});

bot.hears(/[0-9]/, (ctx) => {  
  if(ctx.session.addInstrument){
    let num_1 =  ctx.session.instrument['В наличии ENG'];
    let num_2 =  ctx.message.text;
    let sum = +num_1 + +num_2
    ctx.session.instrument['В наличии ENG'] = sum;
  }
});


bot.start();

// выбрать количество => Записать в переменную
// выбрать регион => Записать выбранное количество в нужный регион
// создать функию add

// Инициализируем сессию как временное хранилище некоторой информации. Объявляем переменную addInstrument с булевым значением изначально установленным на false. При совершении числовых операций ориентироватсья на значение данной переменной относительно совершаемого действия. Прибавление или вычитание. 
