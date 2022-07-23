<script lang="ts">
  import { onDestroy } from 'svelte'
  import { setFormContext } from './helpers'

  type T = $$Generic

  export let initialValues: T
  export let onSubmit: (values: T) => void

  function handleChange(e: Event) {
    const target = e.target as HTMLInputElement
    const { name, value } = target
    console.log('changed', name, 'to', value)
  }

  let monitoredFields: HTMLInputElement[] = []

  setFormContext({
    register(el: HTMLInputElement) {
      el.addEventListener('change', handleChange)
      monitoredFields.push(el)
    },
    isDirty: false,
    submitCount: 0,
    values: {},
    initialValues: {},
  })

  onDestroy(() => {
    monitoredFields.forEach((el) => el.removeEventListener('change', handleChange))
  })
</script>

<slot />
