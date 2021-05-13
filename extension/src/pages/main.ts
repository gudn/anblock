import { storageGet } from '../storage'

export default async function mainPage(
  root: HTMLElement,
  reload: () => Promise<void>
) {
  const username = await storageGet('username')
  if (!username) {
    return reload()
  }
  root.innerText = username
}
