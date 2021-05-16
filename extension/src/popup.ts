import { storageGet } from './storage'
import setUsernamePage from './pages/setUsername'
import mainPage from './pages/main'

const body = document.body

async function init() {
  const username = await storageGet('username')
  body.innerHTML = ''
  if (!username) {
    return setUsernamePage(body, init)
  }
  await mainPage(body, init)
}

chrome.storage.onChanged.addListener(changes => {
  if (changes['alarmInfo']) init()
})
init()
