import { config } from 'dotenv'
import { Telegraf } from 'telegraf'

config()

export const bot = new Telegraf(process.env.BOT_TOKEN)

bot.on('text', ctx => ctx.reply(ctx.message.text))
