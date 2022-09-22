const { Keyboard, InlineKeyboard } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");

const mainMenu = new Keyboard()
  .text("Склад материалов")
  .row()
  .text("Склад инструментов")
  .row()
  .text("Продажа");

const skladMenu = new InlineKeyboard()
.text("Добавить инструмент на склад", "add_instrument");

const materialMenu = new InlineKeyboard()
.text("Добавить материал на склад", "add_material");

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

const addMaterialMenu = new InlineKeyboard()
.text('Bag_стандарт', 'add__Bag стандарт').row()
.text('Bag_эфир', 'add__Bag эфир').row()
.text('Box_Divya', 'add__Box Divya').row()
.text('Планки_дерево_Б', 'add__Планки дерево Б').row()
.text('Планки_дерево_М', 'add__Дерево М').row()
.text('Планки_акрил_Б', 'add__Планки Aкрил Б').row()
.text('Планки_акрил_М', 'add__Планки Акрил М').row()
.text('Подставки', 'add__Подставки').row()
.text('Подставки_акрил', 'add__Подставки акрил').row()
.text('Стики', 'add__Стики').row()

const chooseRegion = new InlineKeyboard()
.text("ENG", "ENG").text("UA", "UA");

const writeTable = new InlineKeyboard()
.text("Записать данные в таблицу", "write_to_table")

module.exports = {
  mainMenu,
  skladMenu,
  addInstrumentMenu,
  chooseRegion,
  writeTable,
  materialMenu,
  addMaterialMenu
};
