export function safeVueInstance(target) {
  return new Proxy(target, {
    get(target, prop) {
      return prop in target ? target[prop] : undefined
    }
  })
}
