<script lang="ts">
  import { writable } from 'svelte/store'
  import { setFormContext, type Values } from './helpers'
  import { readOnly, readStore } from './utils'

  type T = $$Generic

  export let initialValues: T
  export let onSubmit: (values: Record<keyof T, string>) => void

  let values = writable<Values<T, string>>({})
  let touched = writable<Values<T, boolean>>({})
  let errors = writable<Values<T, string>>({})
  let isDirty = writable(false)
  let submitCount = writable(0)

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    const name = target.name as keyof T
    const value = target.value

    console.log('changed', name, 'to', value)

    const isTouched = readStore(touched)[name]
    if (isTouched) check(name, value)
  }

  function check(name: keyof T, value: string) {
    const initialValue = initialValues[name]

    touched.update((touched) => {
      touched[name] = value !== (initialValue as unknown as string)
      return touched
    })

    const hasError = value !== 'zach'
    errors.update((errors) => {
      if (hasError) {
        errors[name] = 'Supposed to be zach'
      } else {
        delete errors[name]
      }
      return errors
    })

    setDirty()
  }

  function setDirty() {
    let touchedVals = Object.values(readStore(touched)) as boolean[]
    isDirty.set(touchedVals.reduce((dirty, current) => dirty || current, false))
  }

  function handleBlur(e: Event) {
    const target = e.target as HTMLInputElement
    const name = target.name as keyof T
    const value = target.value
    check(name, value)
  }

  setFormContext({
    isDirty: readOnly(isDirty),
    submitCount: readOnly(submitCount),
    values: readOnly(values),
    touched: readOnly(touched),
    errors: readOnly(errors),
    initialValues,
    handleInput,
    handleBlur,
  })
</script>

<slot />
