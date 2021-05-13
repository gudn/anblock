import { storageSet } from '../storage'

export default function setUsername(
  root: HTMLElement,
  reload: () => Promise<void>
) {
  const input = document.createElement('input')
  input.className = 'username'
  input.setAttribute('placeholder', 'Enter username')
  input.addEventListener('keyup', e => {
    if (e.code === 'Enter') {
      if (input.value.trim()) {
        storageSet('username', input.value.trim())
          .then(reload)
          .catch(console.error)
      }
      e.preventDefault()
    }
  })
  root.appendChild(input)
}
