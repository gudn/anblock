import type { Rule } from './rule'
import { BACKEND_URL } from './config'

chrome.runtime.onInstalled.addListener(() => {
  console.log('Installed')
})

function listener(request: chrome.webRequest.ResourceRequest) {
  return {
    redirectUrl: `${BACKEND_URL}/redirect`,
  }
}

function setRules(rules: string[]) {
  chrome.webRequest.onBeforeRequest.removeListener(listener)
  if (rules.length) {
    chrome.webRequest.onBeforeRequest.addListener(
      listener,
      { urls: rules, types: ['main_frame'] },
      ['blocking']
    )
  }
}

chrome.storage.onChanged.addListener((changes, _) => {
  if (changes['rules']) {
    const { newValue } = changes['rules']
    const rules = JSON.parse(newValue) as Rule[]
    setRules(
      rules.filter(rule => !rule.disabled).map(rule => `*://${rule.url}/*`)
    )
  }
})
