import { Rule } from '../rule'
import { storageGet, storageSet } from '../storage'

function createWrapper(childs: HTMLElement[], className: string | null = null) {
  const wrapper = document.createElement('div')
  wrapper.className = className ?? ''
  childs.forEach(child => wrapper.appendChild(child))
  return wrapper
}

function ruleView(rule: Rule, root: HTMLElement, rules: Rule[]) {
  const url = document.createElement('span')
  url.innerText = rule.url
  const checkbox = document.createElement('input')
  checkbox.setAttribute('type', 'checkbox')
  checkbox.checked = !rule.disabled
  const button = document.createElement('button')
  button.innerText = 'Delete'
  button.addEventListener('click', () =>
    storageSet('rules', JSON.stringify(rules.filter(it => it.url !== rule.url)))
  )
  checkbox.addEventListener('change', () =>
    storageSet(
      'rules',
      JSON.stringify(
        rules.map(it => {
          if (it.url === rule.url) {
            return {
              url: rule.url,
              disabled: !checkbox.checked,
            }
          }
          return it
        })
      )
    )
  )
  root.appendChild(
    createWrapper([createWrapper([checkbox, url]), button], 'rule')
  )
}

function listRules(root: HTMLElement) {
  const wrapper = createWrapper([], 'rules')
  async function redraw(rules: Rule[]) {
    wrapper.innerHTML = '<hr />'
    rules.forEach(rule => ruleView(rule, wrapper, rules))
    wrapper.appendChild(document.createElement('hr'))
  }
  storageGet('rules').then(value => redraw(value ? JSON.parse(value) : []))
  chrome.storage.onChanged.addListener(changes => {
    if (!changes['rules']) return
    redraw(JSON.parse(changes['rules'].newValue))
  })
  root.appendChild(wrapper)
}

function newItemElement(root: HTMLElement) {
  const input = document.createElement('input')
  const button = document.createElement('button')
  button.innerText = 'Add'
  input.setAttribute('placeholder', 'youtube.com')
  input.addEventListener('keyup', e => {
    if (e.code === 'Enter') {
      e.preventDefault()
      button.click()
    }
  })
  button.addEventListener('click', async () => {
    const value = input.value.trim()
    if (!value) {
      return
    }
    input.value = ''
    const rules = JSON.parse((await storageGet('rules')) ?? '[]') as Rule[]
    if (rules.some(rule => rule.url === value)) {
      return
    }
    rules.push({
      url: value,
      disabled: false,
    })
    storageSet('rules', JSON.stringify(rules))
  })
  root.appendChild(createWrapper([input, button], 'new-item-wrapper'))
}

function header(root: HTMLElement, username: string) {
  const usernameElem = document.createElement('h4')
  usernameElem.innerText = username
  root.appendChild(createWrapper([usernameElem], 'header'))
}

export default async function mainPage(
  root: HTMLElement,
  reload: () => Promise<void>
) {
  const username = await storageGet('username')
  if (!username) {
    return reload()
  }
  header(root, username)
  listRules(root)
  newItemElement(root)
}
