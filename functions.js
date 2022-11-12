let { chooseRegion } = require("./keyabords")

function saleInstrument(ctx, data, bot, tableInfo) {
    let saleInstrument_Query = `${data}`.match(/add__(.+)/g);

    if (data == saleInstrument_Query) {
        data = data.match(/[A-Z].*/g);

        bot.api.deleteMessage(
            ctx.chat.id,
            ctx.update.callback_query.message.message_id
        );

        ctx.session.instrument = tableInfo.findInstrument(data);

        ctx.reply(
            `Вы выбрали <b>${ctx.session.instrument["Инструменты"]}</b>
К какому региону отностися инструмент?`,
            {
                reply_markup: chooseRegion,
                parse_mode: "HTML",
            }
        );
    }

    if (data === "ENG" || data === "UA") {
        ctx.session.region = data;
        bot.api.deleteMessage(
            ctx.chat.id,
            ctx.update.callback_query.message.message_id
        );

        bot.api.sendMessage(
            ctx.chat.id,
            `Вы выбрали <b>${ctx.session.instrument["Инструменты"]}</b>
Регион: <b>${ctx.session.region}</b>
          
Сколько инстурментов желаете  продать?`,
            { parse_mode: "HTML" }
        );
    }

}


module.exports = {
    saleInstrument
}