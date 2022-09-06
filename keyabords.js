const { Keyboard, InlineKeyboard } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const {TableInfo} = require('./dataObj')

let tableInfo = new TableInfo();

const mainMenu = new Keyboard()
.text("Склад материалов").row()
.text("Склад инструментов").row()
.text("Продажа")

const skladMenu = new InlineKeyboard()
.text('Добавить инструмент на склад', 'add_instrument')

const addInstrumentMenu = new InlineKeyboard()
  .text("Fire").row()
  .text("Ether").row()
  .text("Waterfall").row()
  .text("Eternal love").row()
  .text("Alchemy").row()
  .text("Infinity").row()


module.exports = {
    mainMenu,
    skladMenu,
    addInstrumentMenu
}






