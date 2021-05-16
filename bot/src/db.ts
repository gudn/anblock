import { config } from 'dotenv'
import { Tedis } from 'tedis'

config()

const tedis = new Tedis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
})

function toKey(angel: string, username: string): string {
  return `${angel}/${username}`
}

export async function isLocked(
  angel: string,
  username: string
): Promise<boolean> {
  const key = toKey(angel, username)
  return (await tedis.exists(key)) === 1
}

export async function lock(angel: string, username: string, ttl: number = 0) {
  const key = toKey(angel, username)
  await tedis.set(key, '1')
  if (ttl > 0) {
    await tedis.expire(key, ttl)
  }
}

export async function unlock(
  angel: string,
  username: string
): Promise<boolean> {
  const key = toKey(angel, username)
  return (await tedis.del(key)) > 0
}

export async function unlockAll(angel: string): Promise<string[]> {
  const keys = await tedis.keys(`${angel}/*`)
  if (!keys.length) return []
  // @ts-ignore
  await tedis.del(...keys)
  return keys.map(key => key.split('/')[1])
}

export async function getLocks(angel: string): Promise<string[]> {
  const keys = await tedis.keys(`${angel}/*`)
  return keys.map(key => key.split('/')[1]).sort()
}
