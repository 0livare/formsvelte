<script lang="ts">
  import { writable } from 'svelte/store'
  import type { AnySchema } from 'yup'

  import { setFormContext } from './context'
  import { validateSchemaWithYup, validateSingleFieldWithYup } from './yup-validation'
  import { readOnly, getIn, setInStore, getInStore, findNested } from './utils'

  type T = $$Generic

  export let initialValues: T
  export let onSubmit: (values: T) => void
  export let yupSchema: AnySchema | undefined = undefined

  let values = writable<T>(initialValues)
  let touched = writable<Record<string, boolean>>({})
  let errors = writable<Record<string, string>>({})
  let isDirty = writable(false)
  let isValid = writable(true)
  let submitCount = writable(0)

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    const name = target.name as string
    const value = target.value

    setInStore(values, name, value)

    const isTouched: boolean = $submitCount > 0 || $touched[name]
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
    const value = target.value
    const isChecked = target.checked
    const initialVal = getIn(initialValues, name)

    if (Array.isArray(initialVal)) {
      let valArray: any[] = getInStore(values, name) ?? []
      const indexOf = valArray.indexOf(value)
      const alreadyExists = indexOf >= 0
      if (isChecked && !alreadyExists) {
        setInStore(values, name, [...valArray, value])
      } else if (!isChecked && alreadyExists) {
        valArray.splice(indexOf, 1)
        setInStore(values, name, valArray)
      }
    } else {
      setInStore(values, name, isChecked)
    }

    check(name, isChecked)
  }

  function handleChange(e: Event) {
    const target = e.target as HTMLInputElement
    const name = target.name as string
    const value = target.value
    const inputType = target.type

    if (inputType === 'radio') {
      setInStore(values, name, value)
      check(name, value)
    }
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    submitCount.update((count) => count + 1)

    if (yupSchema) {
      validateSchemaWithYup({ schema: yupSchema, errors, values: $values })
    }

    if ($isValid) {
      onSubmit($values)
    } else {
      console.warn('Validation failed -- not submitting form')
      console.warn('isValid: ', $isValid)
      console.warn('errors: ', $errors)
    }
  }

  function check(name: string, value: string | boolean) {
    const initialValue = getIn(initialValues, name)
    const hasBeenTouched = value !== (initialValue as unknown as string)
    touched.update((touched: any) => {
      touched[name] = hasBeenTouched
      return touched
    })

    if (yupSchema) {
      validateSingleFieldWithYup({
        schema: yupSchema,
        values: $values,
        name: name as string,
        errors,
      })
      setValid()
    }
    setDirty()
  }

  function setDirty() {
    isDirty.set(!!findNested($touched, true))
  }

  function setValid() {
    const errorCount = Object.keys($errors ?? {}).length
    isValid.set(errorCount === 0)
  }

  setFormContext({
    isDirty: readOnly(isDirty),
    isValid: readOnly(isValid),
    submitCount: readOnly(submitCount),
    values: values,
    touched: touched,
    errors: errors,
    initialValues,
    handleInput,
    handleBlur,
    handleChecked,
    handleChange,
    handleSubmit,
  })
</script>

<slot />
