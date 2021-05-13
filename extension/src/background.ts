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
  chrome.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: rules, types: ['main_frame'] },
    ['blocking']
  )
}
