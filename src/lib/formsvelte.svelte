<script lang="ts">
  import { onDestroy } from 'svelte'
  import { setFormContext } from './helpers'

  type T = $$Generic

  export let initialValues: T
  export let onSubmit: (values: Record<keyof T, string>) => void

  let values: Partial<Record<keyof T, string>> = {}
  let touched: Partial<Record<keyof T, boolean>> = {}
  let errors: Partial<Record<keyof T, string>> = {}
  let isDirty = false
  let submitCount = 0

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    const name = target.name as keyof T
    const value = target.value

    console.log('changed', name, 'to', value)

    const isTouched = touched[name]
    if (isTouched) check(name, value)
  }

  function check(name: keyof T, value: string) {
    const initialValue = initialValues[name]
    touched[name] = value !== (initialValue as unknown as string)

    const hasError = value !== 'zach'
    if (hasError) {
      errors[name] = 'Supposed to be zach'
    } else {
      delete errors[name]
    }

    console.log({ touched, errors })
    setDirty()
  }

  function setDirty() {
    let touchedVals = Object.values(touched) as boolean[]
    isDirty = touchedVals.reduce((dirty, current) => dirty || current, false)
  }

  function handleBlur(e: Event) {
    const target = e.target as HTMLInputElement
    const name = target.name as keyof T
    const value = target.value
    console.log('blurred', name)
    check(name, value)
  }

  setFormContext({
    isDirty,
    submitCount,
    values,
    touched,
    errors,
    initialValues,
    handleInput,
    handleBlur,
  })

  onDestroy(() => {
    // Object.values(monitoredFields).forEach((el) => el.removeEventListener('change', handleChange))
  })
</script>

<slot />
