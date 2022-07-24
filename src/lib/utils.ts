import type { Readable, Writable } from 'svelte/store'
import { clone, toPath } from 'lodash-es'

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

//
//
// Utils borrowed straight from Formik:
// See: https://github.com/jaredpalmer/formik/blob/e677bea8181f40e6762fc7e7fb009122384500c6/packages/formik/src/utils.ts#L106
//
//

/** @private is the value an empty array? */
export const isEmptyArray = (value?: any) => Array.isArray(value) && value.length === 0

/** @private is the given object a Function? */
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (obj: any): obj is Function => typeof obj === 'function'

/** @private is the given object an Object? */
// eslint-disable-next-line @typescript-eslint/ban-types
export const isObject = (obj: any): obj is Object => obj !== null && typeof obj === 'object'

/** @private is the given object an integer? */
export const isInteger = (obj: any): boolean => String(Math.floor(Number(obj))) === obj

/** @private is the given object a string? */
export const isString = (obj: any): obj is string =>
  Object.prototype.toString.call(obj) === '[object String]'

/** @private is the given object a NaN? */
// eslint-disable-next-line no-self-compare
export const isNaN = (obj: any): boolean => obj !== obj

/** @private is the given object/value a promise? */
export const isPromise = (value: any): value is PromiseLike<any> =>
  isObject(value) && isFunction(value.then)

/**
 * Deeply get a value from an object via its path.
 */
export function getIn(obj: any, key: string | string[], def?: any, p = 0) {
  const path = toPath(key)
  while (obj && p < path.length) {
    obj = obj[path[p++]]
  }
  return obj === undefined ? def : obj
}

/**
 * Deeply set a value from in object via it's path. If the value at `path`
 * has changed, return a shallow copy of obj with `value` set at `path`.
 * If `value` has not changed, return the original `obj`.
 *
 * Existing objects / arrays along `path` are also shallow copied. Sibling
 * objects along path retain the same internal js reference. Since new
 * objects / arrays are only created along `path`, we can test if anything
 * changed in a nested structure by comparing the object's reference in
 * the old and new object, similar to how russian doll cache invalidation
 * works.
 *
 * In earlier versions of this function, which used cloneDeep, there were
 * issues whereby settings a nested value would mutate the parent
 * instead of creating a new object. `clone` avoids that bug making a
 * shallow copy of the objects along the update path
 * so no object is mutated in place.
 *
 * Before changing this function, please read through the following
 * discussions.
 *
 * @see https://github.com/developit/linkstate
 * @see https://github.com/jaredpalmer/formik/pull/123
 */
export function setIn(obj: any, path: string, value: any): any {
  const res: any = clone(obj) // this keeps inheritance when obj is a class
  let resVal: any = res
  let i = 0
  const pathArray = toPath(path)

  for (; i < pathArray.length - 1; i++) {
    const currentPath: string = pathArray[i]
    const currentObj: any = getIn(obj, pathArray.slice(0, i + 1))

    if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
      resVal = resVal[currentPath] = clone(currentObj)
    } else {
      const nextPath: string = pathArray[i + 1]
      resVal = resVal[currentPath] = isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {}
    }
  }

  // Return original object if new value is the same as current
  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj
  }

  if (value === undefined) {
    delete resVal[pathArray[i]]
  } else {
    resVal[pathArray[i]] = value
  }

  // If the path array has a single element, the loop did not run.
  // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
  if (i === 0 && value === undefined) {
    delete res[pathArray[i]]
  }

  return res
}
