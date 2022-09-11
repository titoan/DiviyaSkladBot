const { Keyboard, InlineKeyboard } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");

const mainMenu = new Keyboard()
  .text("Склад материалов")
  .row()
  .text("Склад инструментов")
  .row()
  .text("Продажа");

const skladMenu = new InlineKeyboard().text(
  "Добавить инструмент на склад",
  "add_instrument"
);

const addInstrumentMenu = new InlineKeyboard()
  .text("Fire", "add__Fire")
  .row()
  .text("Ether-Acril", "add__Ether-Acril")
  .row()
  .text("Ether-Wood", "add__Ether-Wood")
  .row()
  .text("Waterfall", "add__Waterfall")
  .row()
  .text("Eternal-love", "add__Eternal-love")
  .row()
  .text("Alchemy", "add__Alchemy")
  .row()
  .text("Infinity", "add__Infinity")
  .row();

const chooseRegion = new InlineKeyboard()
.text("ENG", "ENG").text("UA", "UA");

const writeTable = new InlineKeyboard()
.text("Записать данные в таблицу", "write_to_table")

module.exports = {
  mainMenu,
  skladMenu,
  addInstrumentMenu,
  chooseRegion,
  writeTable
};
