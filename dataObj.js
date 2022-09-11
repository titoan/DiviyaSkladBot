const { Bot } = require("grammy");
const XLSX = require("xlsx");

function TableInfo() {
  this.workbook = XLSX.readFile("data/dataTable.xlsx");
  this.worksheet = this.workbook.Sheets.ready_to_sale;
  this.jsonSheet = XLSX.utils.sheet_to_json(this.worksheet);
  this.userWorkbook;

  this.findInstrument = function(propName){   
    for(item of this.jsonSheet){
      if(item['Инструменты'] == propName){
        return item
      }
    }
  }

  this.getInstruments =  () => this.jsonSheet.map((item) => {    
    return `${item["Инструменты"]}`
  });  

  this.getInstrumentsNumEN = function () {
    return this.jsonSheet.map((item) => `${item["В наличии ENG"]}`);
  };

  this.getInstrumentsNumUA = function () {
    return this.jsonSheet.map((item) => `${item["В наличии UA"]}`);
  };

  this.instrumentsInfoStr = function () {
    let arr = [];
    for (let i = 0; i < this.getInstruments().length; i++) {
      arr.push(
        `🪗 ${this.getInstruments()[i]} - ${this.getInstrumentsNumEN()[i]} / ${this.getInstrumentsNumUA()[i]} \n`
      );
    }
    let str = `${arr}`.replace(/[,]/g, '')
    return str;
  };

  this.addToTable = function(){
    XLSX.utils.sheet_add_json(this.worksheet, this.jsonSheet);

    this.worksheet["!cols"] = [ { wch: 25 } ];

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
