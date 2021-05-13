export function storageGet(key: string): Promise<string | undefined> {
  return new Promise((resolve, reject) =>
    chrome.storage.sync.get([key], items => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      return resolve(items[key])
    })
  )
}

export function storageSet(key: string, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      return resolve()
    })
  })
}
