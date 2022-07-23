import { getContext, setContext } from 'svelte'

export const key = Symbol()

type FormContextShape<T> = {
  register(el: HTMLInputElement)
  isDirty: boolean
  submitCount: number
  values: T
  initialValues: T
}

export function getFormContext<T>() {
  return getContext<FormContextShape<T>>(key)
}

export function setFormContext<T>(formContext: FormContextShape<T>) {
  setContext(key, formContext)
}
