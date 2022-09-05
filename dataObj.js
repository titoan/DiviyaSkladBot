const XLSX = require("xlsx");

function TableInfo() {
  this.workbook = XLSX.readFile("data/dataTable.xlsx");
  this.worksheet = this.workbook.Sheets.store;
  this.jsonSheet = XLSX.utils.sheet_to_json(this.worksheet);
  this.instruments = [];

  this.getInstruments = function () {    
        return this.jsonSheet.map(item=>item['Инструменты готовые к отправке']);
  };
}

module.exports = {
  TableInfo,
};
