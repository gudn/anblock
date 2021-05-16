import { storageGet } from './storage'

export interface BlockAlarm {
  startTime: string
  duration: number
}

export async function getInfo(): Promise<BlockAlarm | null> {
  const entry = await storageGet('alarmInfo')
  if (!entry) return null
  else return JSON.parse(entry) as BlockAlarm
}
