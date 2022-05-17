// Importamos la librería
const { Telegraf, Markup } = require('telegraf');

const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const htmlent = require('html-entities');
const fs = require('fs');

const bot = new Telegraf(process.env.BOT_TOKEN);

const frases = fs.readFileSync('./api/frases.txt', 'utf8');

export default async function webhook(req, res) {
  // comando start
  bot.start((ctx) => {
    return ctx.reply(`Hola ${ctx.message.from.first_name}! 😁`);
  });

  bot.command('wz', async (ctx) => {
    return await ctx.replyWithPhoto({ source: './api/images/wz.jpg' });
  });

  bot.hears(/maru/i, (ctx) => {
    
    const arr = frases.split('\r\n');
    
    const mensaje = arr[Math.floor(Math.random() * arr.length)];
    
    return ctx.reply(mensaje);
  });

  bot.command('dado', async (ctx) => {
    const opts = {
      emoji: '🏀',
    };
    return await ctx.telegram.sendDice(ctx.chat.id, opts);
  });

  bot.command('basket', async (ctx) => {
    const opts = {
      emoji: '🏀',
    };
    return await ctx.telegram.sendDice(ctx.chat.id, opts);
  });

  bot.command('futbol', async (ctx) => {
    const opts = {
      emoji: '⚽',
    };
    return await ctx.telegram.sendDice(ctx.chat.id, opts);
  });

  bot.command('ruleta', async (ctx) => {
    const opts = {
      emoji: '🎰',
    };
    return await ctx.telegram.sendDice(ctx.chat.id, opts);
  });

  bot.command('dolar', async (ctx) => {
    let texto = '';

    //oficial
    const res = await axios.get(
      'https://mercados.ambito.com/dolar/oficial/variacion'
    );

    if (res.status == 200) {
      texto += `<u><b>Dolar Oficial</b></u>\n`;
      texto += `<b>Compra:</b> $ ${res.data.compra} - <b>Venta:</b> $ ${res.data.venta}\n`;
      texto += `<b>Fecha:</b> ${res.data.fecha}\n\n`;
    }

    //informal
    const resinfo = await axios.get(
      'https://mercados.ambito.com/dolar/informal/variacion'
    );

    if (resinfo.status == 200) {
      texto += `<u><b>Dolar Informal</b></u>\n`;
      texto += `<b>Compra:</b> $ ${resinfo.data.compra} - <b>Venta:</b> $ ${resinfo.data.venta}\n`;
      texto += `<b>Fecha:</b> ${resinfo.data.fecha}\n`;
    }

    return await ctx.reply(texto, { parse_mode: 'HTML' });
  });

  // bot handles processed data from the event body
  await bot.handleUpdate(req.body, res);

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
