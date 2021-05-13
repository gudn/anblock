import { BACKEND_URL } from './config'

chrome.runtime.onInstalled.addListener(() => {
  console.log('Installed')
})

chrome.webRequest.onBeforeRequest.addListener(
  req => {
    if (req.url === 'https://vk.com/') {
      return {
        redirectUrl: `${BACKEND_URL}/redirect`,
      }
    }
    return {}
  },
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['blocking']
)
