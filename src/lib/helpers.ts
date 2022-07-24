import { getContext, setContext } from 'svelte'
import { type Readable } from 'svelte/store'

export const key = Symbol()

export type ChangeEvent = Event & {
  target: EventTarget & HTMLInputElement
  currentTarget: EventTarget & HTMLInputElement
  checked: boolean
}

export type Values<T, V> = Partial<Record<keyof T, V>>

type FormContextShape<T> = {
  isDirty: Readable<boolean>
  submitCount: Readable<number>
  initialValues: T
  values: Readable<Values<T, string | boolean>>
  touched: Readable<Values<T, boolean>>
  errors: Readable<Values<T, string>>
  handleInput: (e: Event) => void
  handleBlur: (e: Event) => void
  handleChecked: (e: Event) => void
}

export function getFormContext<T>() {
  return getContext<FormContextShape<T>>(key)
}

export function setFormContext<T>(formContext: FormContextShape<T>) {
  setContext(key, formContext)
}
