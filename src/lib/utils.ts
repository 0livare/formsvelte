import type { Readable, Writable } from 'svelte/store'

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

/**
 * Get the immediate value from a Svelte store
 */
export function readStore<T>(store: Readable<T>): T {
  let myVar: T | null = null
  store.subscribe((myValue) => (myVar = myValue))
  return myVar as T
}

/**
 * Create a read-only version of a writable store
 */
export function readOnly<T>(store: Writable<T>) {
  return { subscribe: store.subscribe }
}
