import { storageSet } from '../storage'

export default function setUsername(
  root: HTMLElement,
  reload: () => Promise<void>
) {
  const input = document.createElement('input')
  const inputRegex = /^[a-zA-Z0-9_]+$/
  let lastValidInput = ''
  function validate() {
    if (input.value === '' || inputRegex.test(input.value)) {
      lastValidInput = input.value
    } else {
      input.value = lastValidInput
    }
  }
  input.className = 'username'
  input.setAttribute('placeholder', 'Enter username')
  input.addEventListener('input', validate)
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
