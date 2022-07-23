export function debounceFn<T>(fn: T, delay = 200): T {
  let timer: NodeJS.Timeout

  // @ts-ignore
  const debouncedFn: T = (...args) => {
    clearTimeout(timer)
    // @ts-ignore
    timer = setTimeout(() => fn(...args), delay)
  }

  return debouncedFn
}
