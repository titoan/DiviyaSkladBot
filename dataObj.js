const { Bot } = require("grammy");
const XLSX = require("xlsx");

function TableInfo() {
  this.workbook = XLSX.readFile("data/dataTable.xlsx");
  this.worksheet_Instruments = this.workbook.Sheets.ready_to_sale;
  this.jsonSheet_Instruments = XLSX.utils.sheet_to_json(this.worksheet_Instruments);
  this.worksheet_Components = this.workbook.Sheets.components;
  this.jsonSheet_Components = XLSX.utils.sheet_to_json(this.worksheet_Components);

  this.findInstrument = function(propName){   
    for(item of this.jsonSheet_Instruments){
      if(item['Инструменты'] == propName){
        return item
      }
    }
  }

  this.findMaterial = function(propName){
    for(item of this.jsonSheet_Components){
      // console.log(item)
      if(item['Комплектация'] == propName){
        return item
      }
    }
  }

  this.getInstruments = () => this.jsonSheet_Instruments.map((item) => `${item["Инструменты"]}`);

  this.getComponents = () => this.jsonSheet_Components.map(item => `${item["Комплектация"]}`);

  this.getComponentsNum = () => this.jsonSheet_Components.map(item => `${item["Количество"]}`)

  this.getInstrumentsNumEN = () => this.jsonSheet_Instruments.map((item) => `${item["В наличии ENG"]}`);  

  this.getInstrumentsNumUA = () => this.jsonSheet_Instruments.map((item) => `${item["В наличии UA"]}`);
  
  this.componentsInfoStr = function(){
    let arr = [];
    for(let i = 0; i < this.getComponents().length; i++){
      arr.push(`🎼 ${this.getComponents()[i]} — ${this.getComponentsNum()[i]}\n`);
    }

    let str = `${arr}`.replace(/[,]/g, '');
    return str;
  }

  this.instrumentsInfoStr = function () {
    let arr = [];
    for (let i = 0; i < this.getInstruments().length; i++) {
      arr.push(
        `🪗 ${this.getInstruments()[i]} — ${this.getInstrumentsNumEN()[i]} / ${this.getInstrumentsNumUA()[i]} \n`
      );
    }
    let str = `${arr}`.replace(/[,]/g, '')
    return str;
  };

  this.addToTable_Instruments = function(){
    XLSX.utils.sheet_add_json(this.worksheet_Instruments, this.jsonSheet_Instruments);

    this.worksheet_Instruments["!cols"] = [ { wch: 25 } ]; // В теории должно давать каждой колонке ширину в 25 символов, но отрабатывает только на первой  

    XLSX.writeFile(this.workbook, "data/dataTable.xlsx");
  }

  this.addToTable_Materials = function(){
    XLSX.utils.sheet_add_json(this.worksheet_Components, this.jsonSheet_Components);

    this.worksheet_Instruments["!cols"] = [ { wch: 25 } ]; // В теории должно давать каждой колонке ширину в 25 символов, но отрабатывает только на первой  

    XLSX.writeFile(this.workbook, "data/dataTable.xlsx");
  }
}

function writePrevMsgId(ctx){
  ctx.session.prevMsgId = ctx.message.message_id;  
}

module.exports = {
  TableInfo,
  writePrevMsgId
};
