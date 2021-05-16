import { config } from 'dotenv'

import express, { Request, Response } from 'express'
import { Markup } from 'telegraf'

import { bot } from './bot'
import { getUserId, isLocked, lock, unlock } from './db'

config()
const app = express()
const PORT = parseInt(process.env.PORT)
const WEBHOOK_PATH = process.env.WEBHOOK_PATH as string
if (WEBHOOK_PATH === undefined) {
  console.error('WEBHOOK_PATH must be provided')
  process.exit(1)
}

app.get('/islocked', async (req: Request, res: Response) => {
  const angel = req.query['angel']
  const username = req.query['username']
  if (!angel || !username) {
    return res.status(400).end()
  }
  const result = await isLocked(
    typeof angel === 'string' ? angel : angel[0],
    typeof username === 'string' ? username : username[0]
  )
  res.json({ result: result }).end()
})

app.post('/lock', async (req: Request, res: Response) => {
  const angels = req.query['angel']
  const usernames = req.query['username']
  if (!angels || !usernames) {
    return res.status(400).end()
  }
  const angel = typeof angels === 'string' ? angels : angels[0]
  const username = typeof usernames === 'string' ? usernames : usernames[0]
  let ttl = 0
  if (req.query['ttl']) {
    const ttlQuery = req.query['ttl']
    if (typeof ttlQuery === 'string') ttl = parseInt(ttlQuery)
    else ttl = parseInt(ttlQuery[0])
  }
  await lock(angel, username, ttl * 60)
  const userId = await getUserId(angel)
  if (userId) {
    bot.telegram.sendMessage(
      userId,
      `New lock for ${username}`,
      Markup.inlineKeyboard([
        [
          {
            text: 'Unlock',
            callback_data: username,
          },
        ],
      ])
    )
  }
  res.status(200).end()
})

bot.telegram.setWebhook(`${WEBHOOK_PATH}/tg`)
app.use(bot.webhookCallback('/tg'))

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
