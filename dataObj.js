const XLSX = require("xlsx");

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

  this.worksheet_Passports = this.workbook.Sheets.passports;
  this.jsonSheet_Passports = XLSX.utils.sheet_to_json( this.worksheet_Passports );


  this.testFunc = () => {  }

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

  this.getItem = (jsonSheet, colName="")=> jsonSheet.map((item) => `${item[colName]}`);

  this.getItemNum = (jsonSheet, colName)=>jsonSheet.map(item=>`${item[colName]}`)

  this.itemsInfoStr = (jsonSheet, colName, colCount, icon) => {
    let arr = [];
    let itemsName = this.getItem(jsonSheet, colName)
    let itemsCount = this.getItemNum(jsonSheet, colCount)    

    for(let i = 0; i < itemsName.length; i++){
      arr.push(`${icon}${itemsName[i]} — ${itemsCount[i]}\n`)
    }

    return `${arr}`.replace(/[,]/g, "");
  }

  this.itemsInfoStrReg = (jsonSheet,colName,colNameEng,colNameUa, icon) => {
    let arr = [];
    let itemsName = this.getItem(jsonSheet, colName)
    let itemsRegEng = this.getItemNum(jsonSheet, colNameEng)
    let itemsRegUa = this.getItemNum(jsonSheet, colNameUa)

    for(let i = 0; i < itemsName.length; i++){
      arr.push(`${icon}${itemsName[i]} — ${itemsRegEng[i]} / ${itemsRegUa[i]}\n`)
    }

    return `${arr}`.replace(/[,]/g, "");
  }

  this.addToTable = (workSheet, jsonSheet)=>{

    // this.setLastChangeDate(this.jsonSheet_Instruments)

    XLSX.utils.sheet_add_json(workSheet, jsonSheet );
    XLSX.writeFile(this.workbook, "data/dataTable.xlsx");
  }

  this.writeOff_Passport = (instrument, colName, region, count)=> {
    
    let name = instrument[colName].toLowerCase()
    
    if(name.match(/ether/)){
      name = "ether";
    }
    console.log(name)
    let passport = this.jsonSheet_Passports.find(item => item["Паспорт"].toLowerCase().match(name))
    console.log(passport)
    passport[`В наличии ${region}`] = passport[`В наличии ${region}`] - count
    
  }

  this.writeOff_Materials = function (number, materials) {

    for(key in materials){
      let findMaterial = this.jsonSheet_Components.filter( (item) => item["Комплектация"] == key );
      findMaterial[0]["Количество"] = findMaterial[0]["Количество"] - materials[key] * number
    }    
  };

  this.writeOfTubes = (instrument, colName, count) => {
    let name = instrument[colName].toLowerCase()
    let tubes = this.jsonSheet_Tubes.find(item => item["Инструменты"].toLowerCase().match(name))
    // console.log(tubes)
  }

  this.setLastChangeDate = (jsonSheet) => {
    dateFild = jsonSheet.find(item => item['Date'])
    curDate = `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    dateFild['Date'] = curDate
  }

  this.getLastChangeDate = (jsonSheet) => {
    try{
      let lastDate = jsonSheet.find(item =>item['Date']);
      console.log(lastDate["Date"])
      return `${lastDate["Date"]}`
    }catch(err){
      if (err) throw err
    }
  } 


  this.material_standart = {
    "Миникорд серый 110 см": 2,
    "Паракорд бордо 35 см":1,
    "Паракорд бордо 48 см":1,
    "Планки дерево Б": 1,
    "Планки дерево М": 1,
    "Стики": 1,
    "Шнур с карабином": 1,
    "Стикеры": 1,
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
    "Стикеры": 1,
    "Флизелин стандарт": 1,
    "Подставки": 1,   
    "Bag эфир": 1,
  };

  this.material_ether_acril = {
    "Миникорд серый 110 см": 2,
    "Паракорд серый 35 см": 1,
    "Паракорд серый 48 см": 1,    
    "Планки акрил Б": 1,
    "Планки акрил М": 1,
    "Стики": 1,
    "Шнур с карабином": 1,
    "Стикеры": 1,
    "Флизелин стандарт": 1,
    "Подставки акрил": 1,   
    "Bag эфир": 1,
  }


}

module.exports = {
  TableInfo,
};

