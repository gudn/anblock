import { config } from 'dotenv'

import express, { Request, Response } from 'express'

import { bot } from './bot'

config()
const app = express()
const PORT = parseInt(process.env.PORT)
const WEBHOOK_PATH = process.env.WEBHOOK_PATH as string
if (WEBHOOK_PATH === undefined) {
  console.error('WEBHOOK_PATH must be provided')
  process.exit(1)
}

app.get('/', (req: Request, res: Response) => res.send('bot'))
bot.telegram.setWebhook(`${WEBHOOK_PATH}/tg`)
app.use(bot.webhookCallback('/tg'))
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
