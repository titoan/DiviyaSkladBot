const XLSX = require("xlsx");
const fs = require("fs");

class Table{
  constructor(path){
    this.path = path
    this.workbook = XLSX.readFile(this.path);
  }
}

class Sheet extends Table{
  constructor(path, sheetName){
    super(path)

    this.worksheet = this.workbook.Sheets[sheetName]
    this.jsonSheet = XLSX.utils.sheet_to_json(this.worksheet);
  }

  findItem = (colName, itemName)=>{
    for (let item of this.jsonSheet) {
      if (item[colName] == itemName) {
        return item;
      }
    }
  }

  getItem = (colName) => this.jsonSheet.map((item) => `${item[colName]}`);

  getItemNum = (colName) => this.jsonSheet.map(item => `${item[colName]}`)

  getItemNumReg = (colName) => this.jsonSheet.map((item) => `${item[colName]}`);

  itemInfoStr = (itemColName, numberColName, icon) => {
    let arr = [];

    this.getItem(itemColName).forEach((item, idx) => {
      arr.push(`${icon} ${item} — ${this.getItemNum(numberColName)[idx]}\n`)
    })

    return `${arr}`.replace(/[,]/g, "");
  }

  itemInfoStrReg = (itemColName, regENG, regUA, icon) => {
    let arr = [];
    for (let i = 0; i < this.getItem(itemColName).length; i++) {
      arr.push(
        `${icon}  ${this.getItem(itemColName)[i]} — ${this.getItemNumReg(regENG)[i]} / ${ this.getItemNumReg(regUA)[i] } \n`
      );
    }

    return `${arr}`.replace(/[,]/g, "");
  }

  writeOff_Materials = (number, materials) => {

    for(key in materials){
      let findMaterial = this.jsonSheet.filter( (item) => item["Комплектация"] == key );
      findMaterial[0]["Количество"] = findMaterial[0]["Количество"] - materials[key] * number
    }    
  };

  addToTable = function () {
    XLSX.utils.sheet_add_json( this.worksheet, this.jsonSheet );

    XLSX.writeFile(this.workbook, "data/dataTable.xlsx");
  };

  material_standart = {
    "Миникорд серый 110 см": 2,
    "Паракорд бордо 35 см":1,
    "Паракорд бордо 48 см":1,
    "Планки дерево Б": 1,
    "Планки дерево М": 1,
    "Стики": 1,
    "Шнур с карабином": 1,
    "Флизелин стандарт": 1,
    "Подставки": 1,
    "Bag стандарт": 1
};

  material_ether = {
    "Миникорд серый 110 см": 2,
    "Паракорд бордо 35 см": 1,
    "Паракорд бордо 48 см": 1,    
    "Планки дерево Б": 1,
    "Планки дерево М": 1,
    "Стики": 1,
    "Шнур с карабином": 1,
    "Флизелин стандарт": 1,
    "Подставки": 1,   
    "Bag эфир": 1,
  };

  material_ether_acril = {
    "Миникорд серый 110 см": 2,
    "Паракорд бордо 35 см": 1,
    "Паракорд бордо 48 см": 1,    
    "Планки акрил Б": 1,
    "Планки акрил М": 1,
    "Стики": 1,
    "Шнур с карабином": 1,
    "Флизелин стандарт": 1,
    "Подставки": 1,   
    "Bag эфир": 1,
  }
}

function TableInfo() {
  this.workbook = XLSX.readFile("data/dataTable.xlsx");

  this.worksheet_Instruments = this.workbook.Sheets.ready_to_sale;
  this.jsonSheet_Instruments = XLSX.utils.sheet_to_json( this.worksheet_Instruments );

  this.worksheet_Components = this.workbook.Sheets.components;
  this.jsonSheet_Components = XLSX.utils.sheet_to_json( this.worksheet_Components );

  this.worksheet_Tubes = this.workbook.Sheets.tubes;
  this.jsonSheet_Tubes = XLSX.utils.sheet_to_json( this.worksheet_Tubes );

  this.worksheet_chainTubes = this.workbook.Sheets.chain_tubes;
  this.jsonSheet_chainTubes = XLSX.utils.sheet_to_json( this.worksheet_chainTubes );

  this.testFunc =  function() {
  let res;
  fs.stat("data/dataTable.xlsx", function(err, stats){
    if(err) throw err
    res = `${stats.mtime}`
  })
  console.log(res)
  return res
  }

  this.findInstrument = function (propName) {
    for (item of this.jsonSheet_Instruments) {
      if (item["Инструменты"] == propName) {
        return item;
      }
    }
  };
  this.findMaterial = function (propName) {
    for (item of this.jsonSheet_Components) {
      if (item["Комплектация"] == propName) {
        return item;
      }
    }
  };
  this.findTubes = function(propName){
    for (item of this.jsonSheet_Tubes) {
      if (item["Инструменты"] == propName) {
        return item;
      }
    }
  }
  this.findChainTubes = function(propName){
    for (item of this.jsonSheet_chainTubes) {
      if (item["Инструменты"] == propName) {
        return item;
      }
    }
  }



  this.getInstruments = () => this.jsonSheet_Instruments.map((item) => `${item["Инструменты"]}`);
  this.getInstrumentsNumEN = () => this.jsonSheet_Instruments.map((item) => `${item["В наличии ENG"]}`);
  this.getInstrumentsNumUA = () => this.jsonSheet_Instruments.map((item) => `${item["В наличии UA"]}`);
  this.instrumentsInfoStr = function () {
    let arr = [];
    for (let i = 0; i < this.getInstruments().length; i++) {
      arr.push(
        `🪗 ${this.getInstruments()[i]} — ${this.getInstrumentsNumEN()[i]} / ${ this.getInstrumentsNumUA()[i] } \n`
      );
    }

    return `${arr}`.replace(/[,]/g, "");
  };

  this.getTubes = () => this.jsonSheet_Tubes.map((item) => `${item["Инструменты"]}`);
  this.getTubesNum = () => this.jsonSheet_Tubes.map(item => `${item["Количество"]}`)
  this.tubesInfoStr = () => {
    let arr = [];

    this.getTubes().forEach((item, idx) => {
      arr.push(`🪗 ${item} — ${this.getTubesNum()[idx]}\n`)
    })

    return `${arr}`.replace(/[,]/g, "");
  }

  this.getChainTubes = () => this.jsonSheet_chainTubes.map((item) => `${item["Инструменты"]}`);
  this.getChainTubesNum = () => this.jsonSheet_chainTubes.map(item => `${item["Количество"]}`)
  this.ChainTubesInfoStr =  () => {
    let arr = [];

    this.getChainTubes().forEach((item, idx) => {
      arr.push(`🎼 ${item} — ${this.getChainTubesNum()[idx]}\n`);
    });

    return `${arr}`.replace(/[,]/g, "");
  };

  this.getComponents = () => this.jsonSheet_Components.map((item) => `${item["Комплектация"]}`);
  this.getComponentsNum = () => this.jsonSheet_Components.map((item) => `${item["Количество"]}`);
  this.componentsInfoStr =  () => {
    let arr = [];

    this.getComponents().forEach((item, idx) => {
      arr.push(`🎼 ${item} — ${this.getComponentsNum()[idx]}\n`);
    });

    return `${arr}`.replace(/[,]/g, "");
  };

  this.addToTable_Instruments = function () {
    XLSX.utils.sheet_add_json( this.worksheet_Instruments, this.jsonSheet_Instruments );

    XLSX.utils.sheet_add_aoa(this.worksheet, [["Инструменты", "В наличии ENG", "В наличии UA","Бронь ENG","Бронь UA"]], { origin: "A1" })
    this.worksheet_Instruments["!cols"] = [ { wch: 20 },{ wch: 20 },{ wch: 20 },{ wch: 20 },{ wch: 20 } ]; 
    

    XLSX.writeFile(this.workbook, "data/dataTable.xlsx");
  };

  this.addTotable_Tubes = function () {
    XLSX.utils.sheet_add_json( this.worksheet_Tubes, this.jsonSheet_Tubes );
    XLSX.writeFile(this.workbook, "data/dataTable.xlsx");
  }

  this.addToTable_Materials = function () {
    XLSX.utils.sheet_add_json( this.worksheet_Components, this.jsonSheet_Components );

    this.worksheet_Components["!cols"] = [{ wch: 25 }]; // В теории должно давать каждой колонке ширину в 25 символов, но отрабатывает только на первой

    XLSX.writeFile(this.workbook, "data/dataTable.xlsx");
  };

  this.addToTable_chainTubes = function(){
    XLSX.utils.sheet_add_json( this.worksheet_chainTubes, this.jsonSheet_chainTubes );
    XLSX.writeFile(this.workbook, "data/dataTable.xlsx");
  }

  this.writeOff_Materials = function (number, materials) {

    for(key in materials){
      let findMaterial = this.jsonSheet_Components.filter( (item) => item["Комплектация"] == key );
      findMaterial[0]["Количество"] = findMaterial[0]["Количество"] - materials[key] * number
    }    
  };

  this.material_standart = {
    "Миникорд серый 110 см": 2,
    "Паракорд бордо 35 см":1,
    "Паракорд бордо 48 см":1,
    "Планки дерево Б": 1,
    "Планки дерево М": 1,
    "Стики": 1,
    "Шнур с карабином": 1,
    "Флизелин стандарт": 1,
    "Подставки": 1,
    "Bag стандарт": 1
};

  this.material_ether = {
    "Миникорд серый 110 см": 2,
    "Паракорд бордо 35 см": 1,
    "Паракорд бордо 48 см": 1,    
    "Планки дерево Б": 1,
    "Планки дерево М": 1,
    "Стики": 1,
    "Шнур с карабином": 1,
    "Флизелин стандарт": 1,
    "Подставки": 1,   
    "Bag эфир": 1,
  };

  this.material_ether_acril = {
    "Миникорд серый 110 см": 2,
    "Паракорд бордо 35 см": 1,
    "Паракорд бордо 48 см": 1,    
    "Планки акрил Б": 1,
    "Планки акрил М": 1,
    "Стики": 1,
    "Шнур с карабином": 1,
    "Флизелин стандарт": 1,
    "Подставки": 1,   
    "Bag эфир": 1,
  }
}

module.exports = {
  TableInfo,
  Table,
  Sheet
};

