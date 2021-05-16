import { config } from 'dotenv'
import { Telegraf, Markup } from 'telegraf'

import { getLocks, unlock, unlockAll } from './db'

config()

export const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('unlockall', async ctx => {
  const username = ctx.message.from.username
  const keys = await unlockAll(username)
  if (keys.length) {
    ctx.reply(`Unlocked ${keys.join(', ')}`)
  } else ctx.reply('No locks')
})

bot.command('locks', async ctx => {
  const locks = await getLocks(ctx.message.from.username)
  if (locks.length) {
    const items = locks.map(lock => ({ text: lock, callback_data: lock }))
    const rows = []
    for (let i = 0; i < items.length; i += 3) {
      const row = items.slice(i, i + 3)
      rows.push(row)
    }
    ctx.reply('Current locks:', Markup.inlineKeyboard(rows))
  } else ctx.reply('No current active locks', Markup.removeKeyboard())
})

bot.action(/.+/, async ctx => {
  const username = ctx.callbackQuery.from.username
  // @ts-ignore
  const target = ctx.callbackQuery.data
  const result = await unlock(username, target)
  if (result) {
    ctx.answerCbQuery(`${target} unlocked`)
  } else ctx.answerCbQuery(`No lock for ${target}`)
  const locks = await getLocks(username)
  const message = ctx.callbackQuery.message
  if (locks.length) {
    const items = locks.map(lock => ({ text: lock, callback_data: lock }))
    const rows = []
    for (let i = 0; i < items.length; i += 3) {
      const row = items.slice(i, i + 3)
      rows.push(row)
    }
    ctx.tg.editMessageReplyMarkup(
      message.chat.id,
      message.message_id,
      undefined,
      { inline_keyboard: rows }
    )
  } else {
    ctx.tg.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      'No current active locks'
    )
  }
})

bot.on('text', ctx => ctx.reply(ctx.message.text))
