const {
	Bot,
	session,
	InputFile
} = require("grammy");
require("dotenv").config();
const {
	mainMenu,
	instrumentsMenu,
	materialMenu,
	addInstrumentsMenu,
	writeTable,
	addMaterialMenu,
	tableMenu,
	tubesMenu,
	addTubes,
	chainTubesMenu,
	addChainTubes,
	passportMenu,
	addPassport
} = require("./keyabords");
const {
	TableInfo
} = require("./dataObj");
const {
	stateToggle
} = require("./functions");
const {
	hydrateFiles
} = require("@grammyjs/files");

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);
bot.api.config.use(hydrateFiles(token));

let tableInfo = new TableInfo();

function initial() {
	return {
		states: {
			addInstrument: false,
			removeInstrument: false,
			saleInstrument: false,
			addMaterial: false,
			removeMaterial: false,
			addTubes: false,
			removeTubes: false,
			addChainTubes: false,
			removeChainTubes: false,
			removePassport: false,
			addPassport: false 
		},
		table: {
			uploadTable: false,
			getTable: false,
		},
		count: 0,
		instrument: {},
		material: {},
		region: "",
	};
}

// ? Пример модификации контекста для передачи одинаковых значений между модулями через контекст
// ? Добавляем в объект контекста экземпляр класса таблицы. 
bot.use(async (ctx, next) => {
	ctx.table = {
		tableObj: tableInfo
	};
	await next();
});


bot.use(session({
	initial
}));
// *подкдючениче динамических клавиатур
bot.use(addInstrumentsMenu, addMaterialMenu, addTubes, addChainTubes, addPassport)

bot.command("start", async (ctx) => {
	tableInfo.testFunc()
	await ctx.reply(
		`Вы находитесь в мастерской. Вероятно, вы здесь не просто так и у вас на сегодняшний день запланирована масса разнообразнейших задач.

Юху-ху-ху! Ну так скорее же вперед на рандеву с производительным трудом!

Ну так и чем займемся?`, {
			reply_markup: mainMenu,
		}
	);
});

bot.hears("Склад инструментов", (ctx) => {
	ctx.reply(
		`Вы на складе инструментов
Здесь светло и просторно. Вдоль стен рядами стоят стелажи. На полках разложены запакованные инструменты. 

Всего доступно инструментов:
Название - ENG/UA
——————————
${tableInfo.itemsInfoStrReg(tableInfo.jsonSheet_Instruments, "Инструменты", "В наличии ENG", "В наличии UA", "🪗")}
    `, {
			reply_markup: instrumentsMenu,
		}
	);
});

bot.hears("Склад материалов", (ctx) => {
	ctx.reply(
		`Вы на складе материалов
Здесь светло и просторно. Вдоль стен рядами стоят стелажи. На полках разложены готовые к использованию материалы. 

Всего доступно материалов:
——————————
${tableInfo.itemsInfoStr(tableInfo.jsonSheet_Components, "Комплектация", "Количество", "🎼")}`, {
			reply_markup: materialMenu
		}
	);
});

bot.hears("Таблица", (ctx) => {
	ctx.reply("Какое действие вам будет угодно совершить?", {
		reply_markup: tableMenu,
	});
});

bot.hears("Частично готово", ctx => {
	ctx.reply(`Ввиду непредвиденных обстоятельств на складе имеются недоукомплектованные инструменты

${tableInfo.itemsInfoStr(tableInfo.jsonSheet_chainTubes, "Инструменты", "Количество", "🎼")}`, {
		reply_markup: chainTubesMenu
	})
})

bot.hears("Трубки", ctx => {
	ctx.reply(`Эти трубки ничем не связаны. Но у вас перед ними, явно, есть некоторые обязательства.  
  
${tableInfo.itemsInfoStr(tableInfo.jsonSheet_Tubes, "Инструменты", "Количество", "🪗")}`, {
		reply_markup: tubesMenu
	})
})

bot.hears("Паспорта", ctx => {

	ctx.reply(`
Паспорта

Название - ENG/UA

${tableInfo.itemsInfoStrReg(tableInfo.jsonSheet_Passports, "Паспорт", "В наличии ENG", "В наличии UA", "🧧")}`, {
		reply_markup: passportMenu
	})
})

bot.on("callback_query:data", async (ctx) => {
	data = ctx.callbackQuery.data;

	// Условия добавления на склад инстурментов
	if (data === "add_instrument" || data === "remove_instrument") {

		stateToggle(ctx, data);

		ctx.reply(`🪗 Какой строй желаете ${data === "add_instrument" ? "добавить на склад" : "изъять со склада"}? 🪗`, {
			reply_markup: addInstrumentsMenu,
		});

	} else if (data === "add_material" || data === "remove_material") {
		stateToggle(ctx, data);

		ctx.reply(`🪗 Какой материал желаете ${data === "add_material" ? "добавить на склад" : "изъять со склада"}? 🪗`, {
			reply_markup: addMaterialMenu
		});
	} else if (data === "sale_instrument") {
		stateToggle(ctx, data);

		ctx.reply(`🪗 Какой инструмент желаете продать? 🪗`, {
			reply_markup: addInstrumentsMenu,
		});
	} else if (data === "add_Tubes" || data === "remove_Tubes") {
		stateToggle(ctx, data);
		ctx.reply(`🪗 Какой строй желаете ${data === "add_Tubes" ? "добавить на склад" : "изъять со склада"}? 🪗`, {
			reply_markup: addTubes,
		});
	} else if (data === "add_chainTubes" || data === "remove_chainTubes") {
		stateToggle(ctx, data);
		ctx.reply(`🪗 Какой строй желаете ${data === "add_chainTubes" ? "добавить на склад" : "изъять со склада"}? 🪗`, {
			reply_markup: addChainTubes,
		});

	} else if (data === "add_passport" || data === "remove_passport") {
		// ! Паспорт
		stateToggle(ctx, data);
		ctx.reply(`🪗 Какой пасспорт желаете ${data === "add_passport" ? "добавить на склад" : "удалить со склада"}? 🪗`, {
			reply_markup: addPassport,
		});
	}

	//? Проверка на выполнения условия для добавления инструмента; Поиск выбранного инструмента; Выбор региона к которому относится инструмент
	if (ctx.session.states.addInstrument) {

		if (data === "ENG" || data === "UA") {
			ctx.session.region = data;

			bot.api.sendMessage(
				ctx.chat.id,
				`Вы выбрали <b>${ctx.session.instrument["Инструменты"]}</b>
Регион: <b>${ctx.session.region}</b>
        
Сколько инстурментов желаете добавить?`, {
					parse_mode: "HTML"
				}
			);
		}
	}

	if (ctx.session.states.saleInstrument || ctx.session.states.removeInstrument) {
		if (data === "ENG" || data === "UA") {
			ctx.session.region = data;

			bot.api.sendMessage( ctx.chat.id,
				`Вы выбрали <b>${ctx.session.instrument["Инструменты"]}</b>
Регион: <b>${ctx.session.region}</b>
        
Сколько инстурментов желаете  ${  ctx.session.states.saleInstrument ? "продать" : "изъять"}?`, {
					parse_mode: "HTML"
				}
			);
		}
	}

	if (ctx.session.states.addPassport || ctx.session.states.removePassport) {
		if (data === "ENG" || data === "UA") {
			ctx.session.region = data;

			bot.api.sendMessage( ctx.chat.id,
				`Вы выбрали <b>${ctx.session.instrument["Паспорт"]}</b>
Регион: <b>${ctx.session.region}</b>
        
Сколько паспортов желаете  ${  ctx.session.states.addPassport ? "добавить" : "улалить"}?`, {
					parse_mode: "HTML"
				}
			);
		}
	}

	// Окончательная запись в таблицу
	if (data === "write_to_table") {
		if (ctx.session.states.addInstrument) {

			if (["Ether-Wood", "Golden-Gate", "Aerial"].includes(ctx.session.instrument["Инструменты"])) {
				try {
					console.log(ctx.session.count)
					await tableInfo.writeOff_Materials(ctx.session.count, tableInfo.material_ether);
				} catch (err) {
					console.log(err)
				}
			} else if (ctx.session.instrument["Инструменты"] == "Ether-Acril") {
				try {
					await tableInfo.writeOff_Materials(ctx.session.count, tableInfo.material_ether_acril);
				} catch (err) {
					console.log(err)
				}
			} else {
				try {
					await tableInfo.writeOff_Materials(ctx.session.count, tableInfo.material_standart, ctx.session.region);
				} catch (err) {
					console.log(err)
				}
			}

			// tableInfo.writeOfTubes(ctx.session.instrument, "Инструменты", ctx.session.count)
			tableInfo.writeOffItems(tableInfo.jsonSheet_chainTubes, ctx.session.instrument, "Инструменты", ctx.session.count)
			tableInfo.writeOff_Passport(ctx.session.instrument, "Инструменты", ctx.session.region, ctx.session.count)

			tableInfo.addToTable(tableInfo.worksheet_Components, tableInfo.jsonSheet_Components)
			tableInfo.addToTable(tableInfo.worksheet_Instruments, tableInfo.jsonSheet_Instruments)
			tableInfo.addToTable(tableInfo.worksheet_Passports, tableInfo.jsonSheet_Passports)
			tableInfo.addToTable(tableInfo.worksheet_Tubes, tableInfo.jsonSheet_Tubes)

			ctx.session.states.addInstrument = false;

			ctx.reply(
				`Результат ваших непосильных усилй записан в таблицу в виде целочисленного значения.
  
Надеюсь, данный ряд совершённых действий имеет за собой не только некоторого рода завпечетленный факт условных показателей производительности, но и удовольствие
      `, {
					reply_markup: mainMenu
				}
			);
		}

		if (ctx.session.states.saleInstrument || ctx.session.states.removeInstrument) {

			tableInfo.addToTable(tableInfo.worksheet_Instruments, tableInfo.jsonSheet_Instruments)

			ctx.session.states.saleInstrument = false;
			ctx.session.states.removeInstrument = false;

			ctx.reply(
				`Результат ваших непосильных усилй записан в таблицу в виде целочисленного значения.
    
Надеюсь, данный ряд совершённых действий имеет за собой не только некоторого рода завпечетленный факт условных показателей производительности, но и удовольствие
        `, {
					reply_markup: mainMenu
				}
			);
		}

		if (ctx.session.states.addMaterial || ctx.session.states.removeMaterial) {

			tableInfo.addToTable(tableInfo.worksheet_Components, tableInfo.jsonSheet_Components)
			ctx.session.states.addMaterial = false;
			ctx.session.states.removeMateria = false;
			ctx.reply(
				`Результат ваших непосильных усилй записан в таблицу в виде целочисленного значения.
  
  Надеюсь, данный ряд совершённых действий имеет за собой не только некоторого рода завпечетленный факт условных показателей производительности, но и удовольствие
      `, {
					reply_markup: mainMenu
				}
			);
		}

		if (ctx.session.states.addTubes || ctx.session.states.removeTubes) {

			tableInfo.addToTable(tableInfo.worksheet_Tubes, tableInfo.jsonSheet_Tubes)

			ctx.session.states.addTubes = false;
			ctx.session.states.removeTubes = false;

			ctx.reply(
				`Результат ваших непосильных усилй записан в таблицу в виде целочисленного значения.
    
Надеюсь, данный ряд совершённых действий имеет за собой не только некоторого рода завпечетленный факт условных показателей производительности, но и удовольствие
        `, {
					reply_markup: mainMenu
				}
			);
		}

		if (ctx.session.states.addPassport || ctx.session.states.removePassport) { 
			tableInfo.writeOffItems(tableInfo.jsonSheet_Passports, ctx.session.instrument, "Паспорт", ctx.session.count)

			tableInfo.addToTable(tableInfo.worksheet_Passports, tableInfo.jsonSheet_Passports)		

			ctx.session.states.addPassport = false;
			ctx.session.states.removePassport = false;

			ctx.reply(
				`Результат ваших непосильных усилй записан в таблицу в виде целочисленного значения.
    
Надеюсь, данный ряд совершённых действий имеет за собой не только некоторого рода завпечетленный факт условных показателей производительности, но и удовольствие
        `, {
					reply_markup: mainMenu
				}
			);
		}

		if (ctx.session.states.addChainTubes || ctx.session.states.removeChainTubes) {
			tableInfo.writeOffItems(tableInfo.jsonSheet_Tubes, ctx.session.instrument, "Инструменты", ctx.session.count)

			tableInfo.addToTable(tableInfo.worksheet_chainTubes, tableInfo.jsonSheet_chainTubes)
			tableInfo.addToTable(tableInfo.worksheet_Tubes, tableInfo.jsonSheet_Tubes)

			ctx.session.states.addTubes = false;
			ctx.session.states.removeTubes = false;

			ctx.reply(
				`Результат ваших непосильных усилй записан в таблицу в виде целочисленного значения.
    
Надеюсь, данный ряд совершённых действий имеет за собой не только некоторого рода завпечетленный факт условных показателей производительности, но и удовольствие
        `, {
					reply_markup: mainMenu
				}
			);
		}
	}

	if (data === "get_table") {
		try {
			await ctx.replyWithDocument(new InputFile("./data/dataTable.xlsx"));
		} catch (err) {
			ctx.reply(`${err.description}`);
			console.log(err);
		}
	} else if (data === "upload_table") {
		ctx.session.table.uploadTable = true;

		ctx.reply("Загрузите таблицу")
	}
});

bot.on("msg:file", async ctx => {

	if (ctx.session.table.uploadTable) {
		const filePath = await ctx.getFile();
		await filePath.download(`data/dataTable.xlsx`);

		await ctx.reply(`Все внесенные вами изменения будут безукоризнено учтены, обработаны и взяты во внимание. Иначе быть и не может. Будьте покойны.

Перезагрузите бота командой /start
  `)

		tableInfo = await new TableInfo();
	}

	ctx.session.table.uploadTable = false;
})

bot.hears(/[0-9]/, (ctx) => {
	if (ctx.session.states.addInstrument) {
		let region = `В наличии ${ctx.session.region}`;
		ctx.session.count = parseInt(ctx.message.text);

		let total = [parseInt(ctx.session.instrument[region]), parseInt(ctx.message.text)].reduce((prev, curr) => prev + curr);

		ctx.session.instrument[`В наличии ${ctx.session.region}`] = total;

		ctx.reply(
			`На склад было добавлено ${ctx.message.text} инструментов ${ctx.session.instrument["Инструменты"]}`, {
				reply_markup: writeTable
			}
		);
	}

	if (ctx.session.states.addMaterial || ctx.session.states.removeMaterial) {
		let total = [parseInt(ctx.session.material["Количество"]), parseInt(ctx.message.text)].reduce((prev, curr) =>
			ctx.session.states.addMaterial ? prev + curr : prev - curr
		);

		ctx.session.material["Количество"] = total;

		ctx.reply(
			`${
        ctx.session.states.addMaterial ? "На склад было добавлено" : "Со склада было изъято" } ${ctx.message.text} ${ctx.session.material["Комплектация"]}`, {
				reply_markup: writeTable
			}
		);
	}

	if (ctx.session.states.saleInstrument || ctx.session.states.removeInstrument) {
		let region = `В наличии ${ctx.session.region}`;

		let total = [parseInt(ctx.session.instrument[region]), parseInt(ctx.message.text)].reduce((prev, curr) => prev - curr);

		ctx.session.instrument[`В наличии ${ctx.session.region}`] = total;

		ctx.reply(
			`Было ${ctx.session.states.removeInstrument ? "изъято" : "продано"} ${
        ctx.message.text
      } инструментов ${ctx.session.instrument["Инструменты"]}`, {
				reply_markup: writeTable
			}
		);
	}

	if (ctx.session.states.addTubes || ctx.session.states.removeTubes) {

		let total = [parseInt(ctx.session.instrument["Количество"]), parseInt(ctx.message.text)].reduce((prev, curr) => ctx.session.states.addTubes ? prev + curr : prev - curr);

		ctx.session.instrument["Количество"] = total;

		ctx.reply(
			`${
        ctx.session.states.addTubes ? "На склад было добавлено" : "Со склада было изъято" } ${ctx.message.text} ${ctx.session.instrument["Инструменты"]}`, {
				reply_markup: writeTable
			}
		);
	}

	if (ctx.session.states.addChainTubes || ctx.session.states.removeChainTubes) {
		ctx.session.count = parseInt(ctx.message.text);
		let total = [parseInt(ctx.session.instrument["Количество"]), parseInt(ctx.message.text)]
			.reduce((prev, curr) => ctx.session.states.addChainTubes ? prev + curr : prev - curr);

		ctx.session.instrument["Количество"] = total;

		ctx.reply(
			`${
        ctx.session.states.addChainTubes ? "На склад было добавлено" : "Со склада было изъято" } ${ctx.message.text} ${ctx.session.instrument["Инструменты"]}`, {
				reply_markup: writeTable
			}
		);
	}
// ! Паспорта
	if (ctx.session.states.addPassport || ctx.session.states.removePassport) {
		let region = `В наличии ${ctx.session.region}`;
		ctx.session.count = parseInt(ctx.message.text);
		let total = [parseInt(ctx.session.instrument[region]), parseInt(ctx.message.text)].reduce((prev, curr) => ctx.session.states.addPassport ? prev + curr : prev - curr);

		ctx.session.instrument[region] = total;

		ctx.reply(
			`${
        ctx.session.states.addPassport ? "На склад было добавлено" : "Со склада было удалено" } ${ctx.message.text} ${ctx.session.instrument["Паспорт"]}`, {
				reply_markup: writeTable
			}
		);
	}
});



bot.start();

/** 
TODO: 
1. Логика удаления - добавления чего-либо. Собрать в отдельную функцию и вызывать эту функуию, а не то, что у тебя сейчас. 
2. Подумать над организацией методов объекта dataObj. Повыносить методы в отдельные файлы
3. Так же посмотреть что ещё можно повыность в отдельные функции, возможно объединить
4. write_to_table -- здесь один сплошной малый круг повторения. Было бы не плохо вынести это все в отдельную функцию. Сделай это пожалуйста. 

**/