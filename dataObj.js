const { Bot } = require("grammy");
const XLSX = require("xlsx");

function TableInfo() {
  this.workbook = XLSX.readFile("data/dataTable.xlsx");
  this.worksheet = this.workbook.Sheets.ready_to_sale;
  this.jsonSheet = XLSX.utils.sheet_to_json(this.worksheet);
  this.instruments = []; 

  this.findInstrument = function(propName){   
    for(item of this.jsonSheet){
      if(item['Инструменты'] == propName){
        return item
      }
    }
  }

  this.getInstruments =  () => this.jsonSheet.map((item) => `${item["Инструменты"]}`);  

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
        `${this.getInstruments()[i]} - ${this.getInstrumentsNumEN()[i]} / ${this.getInstrumentsNumUA()[i]} \n`
      );
    }
    let str = `${arr}`.replace(/[,]/g, '')
    return str;
  };
}


module.exports = {
  TableInfo,
  // getAddInstrument
};
