<script lang="ts">
  import { onDestroy } from 'svelte'
  import { setFormContext } from './helpers'

  type T = $$Generic

  export let initialValues: T
  export let onSubmit: (values: T) => void

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    const { name, value } = target
    console.log('changed', name, 'to', value)
  }

  function handleBlur(e: Event) {
    const target = e.target as HTMLInputElement
    const { name, value } = target
    console.log('blurred', name)
  }

  // let monitoredFields: Record<string, HTMLInputElement> = {}

  // function register(el: HTMLInputElement) {
  //   const { name } = el

  //   const alreadyExists = monitoredFields[name]
  //   if (alreadyExists) {
  //     alreadyExists.removeEventListener('input', handleInput)
  //   }

  //   el.addEventListener('input', handleInput)
  //   monitoredFields[name] = el
  // }

  setFormContext({
    // register,
    isDirty: false,
    submitCount: 0,
    values: {},
    initialValues: {},
    handleInput,
    handleBlur,
  })

  onDestroy(() => {
    // Object.values(monitoredFields).forEach((el) => el.removeEventListener('change', handleChange))
  })
</script>

<slot />
