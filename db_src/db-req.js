const sqlite3 = require('sqlite3');
// const sqlite3 = require('sqlite');
let instruments = require('./instruments_arr.js');

// Так окей база у нас создана то похуй

// ! Надо по-сути сделать несколько функций
// Фугнкция для извлечения всех имен инструментов из БД
// функция для извелчения всех значений инструментов из БД
// Функция для изменения значений инструментов в БД


class SkladDataBase{
  constructor(){
    this.skaldDb;
    this.instruments;
  }

  createDB() {
    return new Promise((resolve, reject) => {
      this.skaldDb = new sqlite3.Database('./data/skald.db', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Connected to the SQlite database.');
          resolve();
        }
      });
    });
  }

  selectValue(name, region){
    return new Promise((resolve, reject) => {
      this.createDB().then(() => {
        this.skaldDb.get(`SELECT ${region} FROM instruments WHERE tool_name = '${name}'`, (err, rows) => {
          if (err) {reject(err);} else {resolve(rows);}
        });
      }).catch((err) => {reject(err)})
      .finally(()=>{this.skaldDb.close(err => {if(err) {console.log(err)} else{console.log('db is close')}})})
    });
  }

  async printValue(name, region){
    try {
      let value = await this.selectValue(name, region);
      console.log(value)
      return value[region];
    } catch (err) {console.error(err.message)}
  }

  selectInstrument(){
    return new Promise((resolve, reject) => {
      this.createDB().then(() => {
        this.skaldDb.all("SELECT tool_name, available_ENG, available_UA FROM instruments", (err, rows) => {
          if (err) {
            reject(err);
          } else {
            this.instruments = rows;
            resolve(rows);
          }
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  async printIstrument(){
    try {
      await this.selectInstrument();
      let arrStr = this.instruments.map(row => `${row.tool_name} — ${row.available_ENG} / ${row.available_UA}\n`);
      
      return `${arrStr}`.replace(/[,]/g, "");
    } catch (err) {
      console.error(err.message);
    }
  }

  async updateAvailability(region, name, value) {  

    let column;
    if (region === 'ENG') {
      column = 'available_ENG';
    } else if (region === 'UA') {
      column = 'available_UA';
    } else {
      throw new Error(`Invalid region value: ${region}`);
    }

    const sql = `UPDATE instruments SET ${column} = ? WHERE tool_name = ?`;
    const params = [value, name];

    this.createDB().then(() =>{
      try {
        this.skaldDb.run(sql, params);
        console.log(`Successfully updated availability for instrument ${name} in region ${region}`);
      } catch (err) {
        console.error(err.message);
      } finally {
        this.skaldDb.close();
      }
    })
  }
}

function createComponentsDB(){
  const db = new sqlite3.Database('./data/skald.db', (err) =>{
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
  });

  db.serialize(()=> {
    db.run(`CREATE TABLE IF NOT EXISTS components(
      components TEXT NOT NULL,
      count INTEGER NOT NULL
    )`, err =>{if (err) {
      return console.error("Error creating table:", err.message);
    } else {
      console.log("Table 'instruments' has been created successfully.");
    }})
  })
}

function createDB() {
  const db = new sqlite3.Database('./data/skald.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
  });

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS instruments (   
      tool_name TEXT NOT NULL,
      available_ENG INTEGER NOT NULL,
      available_UA INTEGER NOT NULL,
      booking_ENG INTEGER NOT NULL,
      booking_UA INTEGER NOT NULL,
      date TEXT NOT NULL
    )`, (err) => {
      if (err) {
        return console.error("Error creating table:", err.message);
      } else {
        console.log("Table 'instruments' has been created successfully.");
      }
    });
  });

  instruments = instruments.instruments;

  addRow(db, instruments);

  addValue(db);

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

const addRow = (db, instruments) => {
  instruments.forEach(item => {
    db.run(`
      INSERT INTO instruments (tool_name, available_ENG, available_UA, booking_ENG, booking_UA, date)
      SELECT ?, ?, ?, ?, ?, ?
      WHERE NOT EXISTS (SELECT 1 FROM instruments WHERE tool_name = ? AND date = ?)
    `,
      [item.tool_name, item.available_ENG, item.available_UA, item.booking_ENG, item.booking_UA, item.date, item.tool_name, item.date], (err) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log('Row added to the instruments table');
        }
      });
  });
}
  

const addValue = (db) => {
  db.run(`UPDATE instruments SET available_ENG = ? WHERE tool_name = ?`, [25, 'Waterfall'], (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Value updated successfully');
    }
  });
}





module.exports = {  
  SkladDataBase,
  createDB,
  createComponentsDB
}