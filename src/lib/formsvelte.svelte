<script lang="ts">
  import { writable } from 'svelte/store'
  import type { AnySchema } from 'yup'

  import { setFormContext, validateSingleField, type Values } from './helpers'
  import { readOnly, readStore, getIn, setInStore, getInStore } from './utils'

  type T = $$Generic

  export let initialValues: T
  export let onSubmit: (values: Values<T, string | boolean>) => void
  export let yupSchema: AnySchema | undefined = undefined

  let values = writable<Values<T, string | boolean>>({})
  let touched = writable<Values<T, boolean>>({})
  let errors = writable<Values<T, string>>({})
  let isDirty = writable(false)
  let submitCount = writable(0)

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    const name = target.name as string
    const value = target.value

    setInStore(values, name, value)

    const isTouched: boolean = getInStore(touched, name)
    if (isTouched) check(name, value)
  }

  function handleBlur(e: Event) {
    const target = e.target as HTMLInputElement
    const name = target.name as string
    const value = target.value
    check(name, value)
  }

  function handleChecked(e: Event) {
    const target = e.target as HTMLInputElement
    const name = target.name as string
    const isChecked = target.checked

    setInStore(values, name, isChecked)
    check(name, isChecked)
  }

  function check(name: string, value: string | boolean) {
    const initialValue = getIn(initialValues, name)
    const newValue = value !== (initialValue as unknown as string)
    setInStore(touched, name, newValue)

    if (yupSchema) {
      validateSingleField({
        schema: yupSchema,
        values: readStore(values),
        name: name as string,
        errors,
      })
    }

    setDirty()
  }

  function setDirty() {
    let touchedVals = Object.values(readStore(touched)) as boolean[]
    isDirty.set(touchedVals.reduce((dirty, current) => dirty || current, false))
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
    handleChecked,
    handleSubmit,
  })
</script>

<slot />
