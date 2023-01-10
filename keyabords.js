const { Keyboard, InlineKeyboard } = require("grammy");
const { Menu } = require("@grammyjs/menu");

// ! Динамическое меню
const addInstrumentsMenu = new Menu("dynamic")
.dynamic((ctx, range) => {
  for(const instrument of ctx.table.tableObj.getItem(ctx.table.tableObj.jsonSheet_Instruments, "Инструменты")){
    range
    .text(instrument, (ctx) => {
      ctx.session.instrument = ctx.table.tableObj.findInstrument(instrument);      
      ctx.reply(
        `Вы выбрали <b>${ctx.session.instrument["Инструменты"]}</b>
Сейчас на складе находится 
ENG: <b>${ctx.session.instrument["В наличии ENG"]}</b> единиц
UA: <b>${ctx.session.instrument["В наличии UA"]}</b> единиц

К какому региону отностися инструмент?`,
        {
          reply_markup: chooseRegion,
          parse_mode: "HTML",
        }
      );
    })
    .row();
  }
});

const addMaterialMenu = new Menu("dynamic_1")
.dynamic((ctx, range) => {
  for(const material of ctx.table.tableObj.getItem(ctx.table.tableObj.jsonSheet_Components, "Комплектация")){
    range
    .text(material, ctx => {      

      ctx.session.material = ctx.table.tableObj.findMaterial(material);
            try {
        ctx.reply(
          `Вы выбрали <b>${material}</b>
Сейчас на складе находится <b>${ctx.session.material["Количество"]}</b> единиц

Какое количество материала желаете ${ctx.session.states.addMaterial ? "добавить" : "изъять"}?`,{ parse_mode: "HTML" });
      } catch (e) {
        console.log(e);
      }
    })
    .row();
  }
})

const addTubes = new Menu("dynamic_2")
.dynamic((ctx, range) => {
  for(const tube of ctx.table.tableObj.getTubes()){
    range
    .text(tube, ctx => {
      ctx.session.instrument = ctx.table.tableObj.findTubes(tube);

      ctx.reply(`
Вы выбрали <b>${ctx.session.instrument["Инструменты"]}</b>

Сейчас на складе находится ${ctx.session.instrument["Количество"]} трубок

Какое количество комплектов трубок желаете ${ctx.session.states.addTubes ? "добавить" : "изъять"}?`,{ parse_mode: "HTML" })
    })
    .row()
  }
})

const addChainTubes = new Menu("dynamic_3")
.dynamic((ctx, range) => {
  for(const chainTube of ctx.table.tableObj.getChainTubes()){
    range
    .text(chainTube, ctx => {
      ctx.session.instrument = ctx.table.tableObj.findChainTubes(chainTube);

      ctx.reply(`
Вы выбрали <b>${ctx.session.instrument["Инструменты"]}</b>

Сейчас на складе находится ${ctx.session.instrument["Количество"]} связанных трубок

Какое количество связанных трубок желаете ${ctx.session.states.addChainTubes ? "добавить" : "изъять"}?`,{ parse_mode: "HTML" })
    })
    .row()
  }

})

const mainMenu = new Keyboard()
  .text("Склад материалов")
  .row()
  .text("Склад инструментов")
  .row()
  .text("Трубки")
  .row()
  .text("Паспорта")
  .row()
  .text("Частично готово")
  .row()
  .text("Таблица")
  .resized();

const instrumentsMenu = new InlineKeyboard()
  .text("Добавить инструмент на склад", "add_instrument")
  .text("Изъять инструмент со склада", "remove_instrument")
  .row()
  .text("Продать инструмент", "sale_instrument");

  const tubesMenu = new InlineKeyboard()
  .text("Добавить трубки на склад", "add_Tubes")
  .text("Изъять трубки со склада", "remove_Tubes")

  const chainTubesMenu = new InlineKeyboard()
  .text("Добавить инструмент на склад", "add_chainTubes")
  .text("Изъять инструмент со склада", "remove_chainTubes")

const materialMenu = new InlineKeyboard()
  .text("Добавить материал на склад", "add_material")
  .text("Изъять материал cо склада", "remove_material");

const tableMenu = new InlineKeyboard()
  .text("Получить таблицу", "get_table")
  .row()
  .text("Загрузить таблицу", "upload_table");

const chooseRegion = new InlineKeyboard().text("ENG", "ENG").text("UA", "UA");

const writeTable = new InlineKeyboard().text(
  "Записать данные в таблицу",
  "write_to_table"
);

module.exports = {
  mainMenu,
  instrumentsMenu,
  addInstrumentsMenu,
  chooseRegion,
  writeTable,
  materialMenu,
  addMaterialMenu,
  tableMenu,
  tubesMenu,
  addTubes,
  chainTubesMenu,
  addChainTubes
}
