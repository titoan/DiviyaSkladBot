const { Keyboard, InlineKeyboard } = require("grammy");


const mainMenu = new Keyboard()
.text("Склад материалов").row()
.text("Склад инструментов").row()
.text("Продажа")

module.exports = {
    mainMenu
}