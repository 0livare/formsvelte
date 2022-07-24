<script lang="ts">
  import { writable } from 'svelte/store'
  import type { AnySchema } from 'yup'

  import { setFormContext, type Values } from './context'
  import { validateSchemaWithYup, validateSingleFieldWithYup } from './yup-validation'
  import {
    readOnly,
    readStore,
    getIn,
    setInStore,
    getInStore,
    removeEmptyNestedObjects,
  } from './utils'

  type T = $$Generic

  export let initialValues: T
  export let onSubmit: (values: Values<T, string | boolean>) => void
  export let yupSchema: AnySchema | undefined = undefined

  let values = writable<Values<T, string | boolean>>({})
  let touched = writable<Values<T, boolean>>({})
  let errors = writable<Values<T, string>>({})
  let isDirty = writable(false)
  let isValid = writable(true)
  let submitCount = writable(0)

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    const name = target.name as string
    const value = target.value

    setInStore(values, name, value)

    const _submitCount = readStore(submitCount)
    const isTouched: boolean = _submitCount > 0 || getInStore(touched, name)
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

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    submitCount.update((count) => count + 1)

    if (yupSchema) {
      validateSchemaWithYup({ schema: yupSchema, errors, values })
      errors.update((errors) => removeEmptyNestedObjects(errors))
    }

    if (readStore(isValid)) {
      onSubmit(readStore(values))
    } else {
      console.warn('Validation failed -- not submitting form')
      console.warn('isValid: ', readStore(isValid))
      console.warn('errors: ', readStore(errors))
    }
  }

  function check(name: string, value: string | boolean) {
    const initialValue = getIn(initialValues, name)
    const newValue = value !== (initialValue as unknown as string)
    setInStore(touched, name, newValue)

    if (yupSchema) {
      validateSingleFieldWithYup({
        schema: yupSchema,
        values: readStore(values),
        name: name as string,
        errors,
      })
      errors.update((errors) => removeEmptyNestedObjects(errors))
      setValid()
    }
    setDirty()
  }

  function setDirty() {
    let touchedVals = Object.values(readStore(touched)) as boolean[]
    isDirty.set(touchedVals.reduce((dirty, current) => dirty || current, false))
  }

  function setValid() {
    // This error count won't always be accurate for
    // nested objects, but it's good enough to give
    // a binary answer for isValid
    const errorCount = Object.keys(readStore(errors)).length
    isValid.set(errorCount === 0)
  }

  setFormContext({
    isDirty: readOnly(isDirty),
    isValid: readOnly(isValid),
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
