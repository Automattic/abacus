export function createUnresolvingPromise() {
  return new Promise(() => null)
}
