import { getContext, setContext } from 'svelte'
import type { Readable, Writable } from 'svelte/store'

export const key = Symbol()

export type FormContextShape<T> = {
  isDirty: Readable<boolean>
  isValid: Readable<boolean>
  submitCount: Readable<number>
  initialValues: T
  values: Writable<T>
  touched: Writable<Record<string, boolean>>
  errors: Writable<Record<string, string>>
  handleInput: (e: Event) => void
  handleBlur: (e: Event) => void
  handleChecked: (e: Event) => void
  handleChange: (e: Event) => void
  handleSubmit: (e: SubmitEvent) => void
}

export function getFormContext<T>() {
  return getContext<FormContextShape<T>>(key)
}

export function setFormContext<T>(formContext: FormContextShape<T>) {
  setContext(key, formContext)
}
