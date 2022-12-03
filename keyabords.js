const { Keyboard, InlineKeyboard } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");

// ! Динамическое меню
const addInstrumentsMenu = new Menu("dynamic")
.dynamic((ctx, range) => {
  for(const instrument of ctx.table.tableObj.getInstruments()){
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
  for(const material of ctx.table.tableObj.getComponents()){
    range
    .text(material, ctx => {
      ctx.session.material = ctx.table.tableObj.findMaterial(material);
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
    })
    .row();
  }
})

const mainMenu = new Keyboard()
  .text("Склад материалов")
  .row()
  .text("Склад инструментов")
  .row()
  .text("Частично готово")
  .row()
  .text("Таблица")
  .resized();

const instrumentsMenu = new InlineKeyboard()
  .text("Добавить инструмент на склад", "add_instrument")
  .text("Забрать инструмент со склада", "remove_instrument")
  .row()
  .text("Продать инструмент", "sale_instrument");

const materialMenu = new InlineKeyboard()
  .text("Добавить материал на склад", "add_material")
  .text("Забрать материал cо склада", "remove_material");

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
};
