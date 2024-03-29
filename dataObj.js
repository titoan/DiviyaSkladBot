const XLSX = require("xlsx");

function TableInfo() {
  this.workbook = XLSX.readFile("data/dataTable.xlsx");

  this.worksheet_Instruments = this.workbook.Sheets.ready_to_sale;
  this.jsonSheet_Instruments = XLSX.utils.sheet_to_json( this.worksheet_Instruments );

  this.worksheet_Components = this.workbook.Sheets.components;
  this.jsonSheet_Components = XLSX.utils.sheet_to_json( this.worksheet_Components );

  this.worksheet_Tubes = this.workbook.Sheets.tubes;
  this.jsonSheet_Tubes = XLSX.utils.sheet_to_json(this.worksheet_Tubes);

  this.worksheet_chainTubes = this.workbook.Sheets.chain_tubes;
  this.jsonSheet_chainTubes = XLSX.utils.sheet_to_json( this.worksheet_chainTubes );

  this.worksheet_Passports = this.workbook.Sheets.passports;
  this.jsonSheet_Passports = XLSX.utils.sheet_to_json(this.worksheet_Passports);

  this.worksheet_salesBot = this.workbook.Sheets.sales_bot;
  this.jsonSheet_salesBot = XLSX.utils.sheet_to_json(this.worksheet_salesBot);

  this.testFunc = () => {};

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

  this.findTubes = function (propName) {
    for (item of this.jsonSheet_Tubes) {
      if (item["Инструменты"] == propName) {
        return item;
      }
    }
  };

  this.findChainTubes = function (propName) {
    for (item of this.jsonSheet_chainTubes) {
      if (item["Инструменты"] == propName) {
        return item;
      }
    }
  };

  // ! Должен заменить собой все методы выше !!!!
  this.findItems = function(sheetName, propName, colName){    
    for (item of sheetName) {
      if (item[colName] == propName) {
        return item;
      }
    }
  }

  this.getItem = (jsonSheet, colName = "") =>
    jsonSheet.map((item) => `${item[colName]}`);

  this.getItemNum = (jsonSheet, colName) =>
    jsonSheet.map((item) => `${item[colName]}`);

  this.itemsInfoStr = (jsonSheet, colName, colCount, icon) => {
    let arr = [];
    let itemsName = this.getItem(jsonSheet, colName);
    let itemsCount = this.getItemNum(jsonSheet, colCount);

    for (let i = 0; i < itemsName.length; i++) {
      arr.push(`${icon}${itemsName[i]} — ${itemsCount[i]}\n`);
    }

    return `${arr}`.replace(/[,]/g, "");
  };

  this.itemsInfoStrReg = (jsonSheet, colName, colNameEng, colNameUa, icon) => {
    let arr = [];
    let itemsName = this.getItem(jsonSheet, colName);
    let itemsRegEng = this.getItemNum(jsonSheet, colNameEng);
    let itemsRegUa = this.getItemNum(jsonSheet, colNameUa);

    for (let i = 0; i < itemsName.length; i++) {
      arr.push(
        `${icon}${itemsName[i]} — ${itemsRegEng[i]} / ${itemsRegUa[i]}\n`
      );
    }

    return `${arr}`.replace(/[,]/g, "");
  };

  this.addToTable = (workSheet, jsonSheet) => {
    this.setLastChangeDate(jsonSheet);

    XLSX.utils.sheet_add_json(workSheet, jsonSheet);
    XLSX.writeFile(this.workbook, "data/dataTable.xlsx");
  };

  this.writeSale = (obj) => {
    
    const date = new Date();
		const curDate = `${date.getDate()}.${ date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}.${date.getFullYear()} ${
		date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;

    obj["Дата"] = curDate;
    this.jsonSheet_salesBot.push(obj)
    
    console.log(this.jsonSheet_salesBot)
    try{
      XLSX.utils.sheet_add_json(this.worksheet_salesBot, this.jsonSheet_salesBot);
      XLSX.writeFile(this.workbook, "data/dataTable.xlsx");
    }catch(err){
      console.log('Ошибка записи в таблицу sales_bot', err)
    }
    
  }

  this.writeOff_Passport = (instrument, colName, region, count) => {
    let name = instrument[colName].toLowerCase();

    if (name.match(/ether/)) {
      name = "ether";
    }

    let passport = this.jsonSheet_Passports.find((item) =>
      item["Паспорт"].toLowerCase().match(name)
    );

    passport[`В наличии ${region}`] = passport[`В наличии ${region}`] - count;
  };

  this.writeOfTubes = (instrument, colName, count) => {
    let name = instrument[colName].toLowerCase();

    if (name.match(/ether/)) {
      name = "ether";
    }
    let tubes = this.jsonSheet_Tubes.find((item) =>
      item[colName].toLowerCase().match(name)
    );
    tubes["Количество"] = tubes["Количество"] - count;
  };

  this.writeOffItems = (jsonSheet, instrument, colName, count) => {
    let name = instrument[colName].toLowerCase();    
    if (name.match(/ether/)) {
      name = "ether";
    }
    let tubes = jsonSheet.find((item) =>
      item[colName].toLowerCase().match(name)
    );
    tubes["Количество"] = tubes["Количество"] - count;
  };

  this.writeOff_Materials = async function (number, materials) {
    for (key in materials) {
      let [findMaterial] = this.jsonSheet_Components.filter((item) => item["Комплектация"] == key);
      console.log(findMaterial)
      findMaterial["Количество"] = findMaterial["Количество"] - materials[key] * number;
    }
  };

  this.setLastChangeDate = (jsonSheet) => {
    dateFild = jsonSheet.find( (item) => item["Комплектация"] || item["Инструменты"] || item["Паспорт"] );
    const date = new Date
    curDate = `${date.getDate()}.${ date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}.${date.getFullYear()} ${
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    }`;
    dateFild["Date"] = curDate;
  };

  this.getLastChangeDate = (jsonSheet) => {
    try {
      let lastDate = jsonSheet.find(
        (item) => item["Комплектация"] || item["Инструменты"] || item["Паспорт"]
      );

      return `${lastDate["Date"]}`;
    } catch (err) {
      if (err) throw err;
    }
  };

  this.material_standart = {
    "Миникорд серый 110 см": 2,
    "Паракорд бордо 35 см": 1,
    "Паракорд бордо 48 см": 1,
    "Планки дерево Б": 1,
    "Планки дерево М": 1,
    "Стики дерево": 1,
    "Шнур с карабином": 1,
    "Стикеры": 1,
    "Флизелин стандарт": 1,
    "Подставки дерево": 1,
    "Bag стандарт": 1,
  };

  this.material_ether = {
    "Миникорд серый 110 см": 2,
    "Паракорд бордо 35 см": 1,
    "Паракорд бордо 48 см": 1,
    "Планки дерево Б": 1,
    "Планки дерево М": 1,
    "Стики дерево": 1,
    "Шнур с карабином": 1,
    "Стикеры": 1,
    "Флизелин Ефир": 1,
    "Подставки дерево": 1,
    "Bag эфир": 1,
  };

  this.material_ether_acril = {
    "Миникорд серый 110 см": 2,
    "Паракорд серый 35 см": 1,
    "Паракорд серый 48 см": 1,
    "Планки акрил Б": 1,
    "Планки акрил М": 1,
    "Стики акрил": 1,
    "Шнур с карабином": 1,
    "Стикеры": 1,
    "Флизелин Ефир": 1,
    "Подставки акрил": 1,
    "Bag эфир": 1,
  };
}

module.exports = {
  TableInfo,
};
