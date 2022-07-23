import { getContext, setContext } from 'svelte'

export const key = Symbol()

export type ChangeEvent = Event & {
  target: EventTarget & HTMLInputElement
  currentTarget: EventTarget & HTMLInputElement
  checked: boolean
}

type FormContextShape<T> = {
  // register(el: HTMLInputElement)
  isDirty: boolean
  submitCount: number
  values: T
  initialValues: T
  handleInput: (e: Event) => void
  handleBlur: (e: Event) => void
}

export function getFormContext<T>() {
  return getContext<FormContextShape<T>>(key)
}

export function setFormContext<T>(formContext: FormContextShape<T>) {
  setContext(key, formContext)
}
