import { config } from 'dotenv'

import express, { Request, Response } from 'express'

config()
const app = express()
const PORT = parseInt(process.env.PORT)

app.get('/', (req: Request, res: Response) => res.send('bot'))
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
