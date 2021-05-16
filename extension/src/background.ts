import type { Rule } from './rule'
import { BlockAlarm, getInfo } from './alarm'
import { BACKEND_URL } from './config'
import { storageGet } from './storage'

function listener(request: chrome.webRequest.ResourceRequest) {
  return {
    redirectUrl: `${BACKEND_URL}/redirect`,
  }
}

function setRules(rules: Rule[]) {
  chrome.webRequest.onBeforeRequest.removeListener(listener)
  if (rules.length) {
    chrome.webRequest.onBeforeRequest.addListener(
      listener,
      {
        urls: rules
          .filter(rule => !rule.disabled)
          .map(rule => `*://${rule.url}/*`),
        types: ['main_frame'],
      },
      ['blocking']
    )
  }
}

chrome.storage.onChanged.addListener(async changes => {
  let blockActive: boolean
  if (changes['alarmInfo']) {
    const { newValue } = changes['alarmInfo']
    if (newValue === undefined) {
      blockActive = false
      await chrome.alarms.clear('BlockAlarm')
    } else {
      blockActive = true
      const info = JSON.parse(newValue) as BlockAlarm
      if (info.duration > 0) {
        chrome.alarms.create('BlockAlarm', {
          when: Date.parse(info.startTime) + info.duration * 60 * 1000,
        })
      }
    }
  } else {
    blockActive = (await getInfo()) !== null
  }
  if (changes['rules'] && blockActive) {
    const { newValue } = changes['rules']
    const rules = JSON.parse(newValue) as Rule[]
    setRules(rules)
  } else if (changes['alarmInfo']) {
    if (blockActive) {
      const entry = await storageGet('rules')
      const rules = JSON.parse(entry ?? '[]') as Rule[]
      setRules(rules)
    } else {
      setRules([])
    }
  }
})

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name !== 'BlockAlarm') return
  await chrome.storage.sync.remove('alarmInfo')
})
