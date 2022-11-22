// ! Создать массив инстурментов. Для вывода меню инстурментов использовать @grammyjs/menu => MenuRange
const { Bot, session, InputFile } = require("grammy");
require("dotenv").config();
const {
  mainMenu,
  skladMenu,
  materialMenu,
  addInstrumentMenu,
  chooseRegion,
  writeTable,
  addMaterialMenu,
  tableMenu,
} = require("./keyabords");
const { TableInfo } = require("./dataObj");
const { saleInstrument, stateToggle } = require("./functions");
const fs = require("fs");
const { hydrateFiles } = require("@grammyjs/files");
const XLSX = require("xlsx");



const token = process.env.BOT_TOKEN;
const bot = new Bot(token);
bot.api.config.use(hydrateFiles(token));

let tableInfo = new TableInfo();

function initial() {
  return {
    states: {
      addInstrument: false,
      removeInstrument: false,
      saleInstrument: false,
      addMaterial: false,
      removeMaterial: false,
    },
    table: {
      uploadTable: false,
      getTable: false,
    },
    count: 0,
    instrument: {},
    material: {},
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

bot.hears("Склад материалов", (ctx) => {
  ctx.reply(
    `Вы на складе материалов
Здесь светло и просторно. Вдоль стен рядами стоят стелажи. На полках разложены готовые к сборке материалы. 
  
Всего доступно материалов:
——————————
${tableInfo.componentsInfoStr()}`,
    { reply_markup: materialMenu }
  );
});

bot.hears("Таблица", (ctx) => {
  ctx.reply("Какое действие вам будет угодно совершить?", {
    reply_markup: tableMenu,
  });
});

bot.on("callback_query:data", async (ctx) => {
  data = ctx.callbackQuery.data;

  // Условия добавления на склад инстурментов
  if (data === "add_instrument" || data === "remove_instrument") {
    bot.api.deleteMessage(
      ctx.chat.id,
      ctx.update.callback_query.message.message_id
    );

    stateToggle(ctx, data);

    ctx.reply(`🪗 Какой строй желаете добавить на склад? 🪗`, {
      reply_markup: addInstrumentMenu,
    });
  } else if (data === "add_material" || data === "remove_material") {
    bot.api.deleteMessage(
      ctx.chat.id,
      ctx.update.callback_query.message.message_id
    );

    stateToggle(ctx, data);

    ctx.reply(
      `🪗 Какой материал желаете ${
        data === "add_material" ? "добавить на склад" : "изъять со склада"
      }? 🪗`,
      {
        reply_markup: addMaterialMenu,
      }
    );
  } else if (data === "sale_instrument") {
    stateToggle(ctx, data);

    ctx.reply(`🪗 Какой инструмент желаете продать? 🪗`, {
      reply_markup: addInstrumentMenu,
    });
  }

  //? Проверка на выполнения условия для добавления инструмента; Поиск выбранного инструмента; Выбор региона к которому относится инструмент
  if (ctx.session.states.addInstrument) {
    let addInstrument_Query = `${data}`.match(/add__(.+)/g);
    if (data == addInstrument_Query) {
      data = data.match(/[A-Z].*/g); // извлечение названия инстурмента

      bot.api.deleteMessage(
        ctx.chat.id,
        ctx.update.callback_query.message.message_id
      );

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
      bot.api.deleteMessage(
        ctx.chat.id,
        ctx.update.callback_query.message.message_id
      );

      bot.api.sendMessage(
        ctx.chat.id,
        `Вы выбрали <b>${ctx.session.instrument["Инструменты"]}</b>
Регион: <b>${ctx.session.region}</b>
        
Сколько инстурментов желаете добавить?`,
        { parse_mode: "HTML" }
      );
    }
  }

  if (ctx.session.states.addMaterial || ctx.session.states.removeMaterial) {
    let addMaterial_Query = `${data}`.match(/add__(.+)/g);
    if (data == addMaterial_Query) {
      data = data.match(/[A-ZА-Я].*/g);
      bot.api.deleteMessage(
        ctx.chat.id,
        ctx.update.callback_query.message.message_id
      );
      ctx.session.material = tableInfo.findMaterial(data);

      try {
        ctx.reply(
          `Вы выбрали <b>${ctx.session.material["Комплектация"]}</b>
Сейчас на складе находится <b>${ctx.session.material["Количество"]}</b> единиц

Какое количество материала желаете ${
            ctx.session.states.addMaterial ? "добавить" : "изъять"
          }?`,
          { parse_mode: "HTML" }
        );
      } catch (e) {
        console.log(e);
      }
    }
  }

  if (
    ctx.session.states.saleInstrument ||
    ctx.session.states.removeInstrument
  ) {
    saleInstrument(ctx, data, bot, tableInfo);
  }

  // Окончательная запись в таблицу
  if (data === "write_to_table") {
    if (ctx.session.states.addInstrument) {
      // FIXME: а вот как?
      if (ctx.session.instrument["Инструменты"] == "Ether-Wood") {
        await tableInfo.writeOff_Materials(
          ctx.session.count,
          tableInfo.material_ether
        );
      } else if (ctx.session.instrument["Инструменты"] == "Ether-Acril") {
        await tableInfo.writeOff_Materials(
          ctx.session.count,
          tableInfo.material_ether_acril
        );
      } else {
        await tableInfo.writeOff_Materials(
          ctx.session.count,
          tableInfo.material_standart
        );
      }

      await tableInfo.addToTable_Materials();
      await tableInfo.addToTable_Instruments();

      ctx.session.states.addInstrument = false;

      ctx.reply(
        `Результат ваших непосильных усилй записан в таблицу в виде целочисленного значения.
  
  Надеюсь, данный ряд совершённых действий имеет за собой не только некоторого рода завпечетленный факт условных показателей производительности, но и удовольствие
      `,
        { reply_markup: mainMenu }
      );
    }

    if (
      ctx.session.states.saleInstrument ||
      ctx.session.states.removeInstrument
    ) {
      tableInfo.addToTable_Instruments();
      ctx.session.states.saleInstrument = false;
      ctx.session.states.removeInstrument = false;

      ctx.reply(
        `Результат ваших непосильных усилй записан в таблицу в виде целочисленного значения.
    
  Надеюсь, данный ряд совершённых действий имеет за собой не только некоторого рода завпечетленный факт условных показателей производительности, но и удовольствие
        `,
        { reply_markup: mainMenu }
      );
    }

    if (ctx.session.states.addMaterial || ctx.session.states.removeMaterial) {
      tableInfo.addToTable_Materials();
      ctx.session.states.addMaterial = false;
      ctx.session.states.removeMateria = false;
      ctx.reply(
        `Результат ваших непосильных усилй записан в таблицу в виде целочисленного значения.
  
  Надеюсь, данный ряд совершённых действий имеет за собой не только некоторого рода завпечетленный факт условных показателей производительности, но и удовольствие
      `,
        { reply_markup: mainMenu }
      );
    }
  }

  if (data === "get_table") {
    try {
      await ctx.replyWithDocument(new InputFile("./data/dataTable.xlsx"));
    } catch (err) {
      ctx.reply(`${err.description}`);
      console.log(err);
    }
  } else if (data === "upload_table") {
    ctx.session.table.uploadTable = true;
    
    ctx.reply("Загрузите таблицу")
  }
});

bot.on("msg:file", async ctx => {

if(ctx.session.table.uploadTable){
  const filePath = await ctx.getFile();
  await filePath.download(`data/dataTable.xlsx`); 

  await ctx.reply('Файл загружон')

  tableInfo = await new TableInfo();   
}

ctx.session.table.uploadTable = false;
})

bot.hears(/[0-9]/, (ctx) => {
  if (ctx.session.states.addInstrument) {
    let region = `В наличии ${ctx.session.region}`;
    ctx.session.count = parseInt(ctx.message.text);

    let total = [
      parseInt(ctx.session.instrument[region]),
      parseInt(ctx.message.text),
    ].reduce((prev, curr) => prev + curr);

    ctx.session.instrument[`В наличии ${ctx.session.region}`] = total;

    ctx.reply(
      `На склад было добавлено ${ctx.message.text} инструментов ${ctx.session.instrument["Инструменты"]}`,
      { reply_markup: writeTable }
    );
  }

  if (ctx.session.states.addMaterial || ctx.session.states.removeMaterial) {
    let total = [
      parseInt(ctx.session.material["Количество"]),
      parseInt(ctx.message.text),
    ].reduce((prev, curr) =>
      ctx.session.states.addMaterial ? prev + curr : prev - curr
    );

    ctx.session.material["Количество"] = total;

    ctx.reply(
      `${
        ctx.session.states.addMaterial
          ? "На склад было добавлено"
          : "Со склада было изъято"
      } ${ctx.message.text} ${ctx.session.material["Комплектация"]}`,
      { reply_markup: writeTable }
    );
  }

  if ( ctx.session.states.saleInstrument || ctx.session.states.removeInstrument ) {
    let region = `В наличии ${ctx.session.region}`;

    let total = [
      parseInt(ctx.session.instrument[region]),
      parseInt(ctx.message.text),
    ].reduce((prev, curr) => prev - curr);

    ctx.session.instrument[`В наличии ${ctx.session.region}`] = total;

    ctx.reply(
      `Было ${ctx.session.states.removeInstrument ? "изъято" : "продано"} ${
        ctx.message.text
      } инструментов ${ctx.session.instrument["Инструменты"]}`,
      { reply_markup: writeTable }
    );
  }
});

bot.start();

/** 
TODO:

**/
