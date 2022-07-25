<script lang="ts">
  import { getFormContext } from './context'
  import { debounceFn, getIn, getInStore } from './utils'

  export let name: string
  export let type: 'text' | 'checkbox' | 'radio' = 'text'
  export let value: string | undefined = undefined
  let className: string | undefined = undefined
  export { className as class }

  const { handleInput, handleBlur, handleChecked, handleChange, errors, values } =
    getFormContext<any>()

  $: determinedValue = getIn($values, name) ?? ''
  $: checkboxChecked = Array.isArray(determinedValue)
    ? determinedValue.includes(value)
    : determinedValue

  const debouncedHandleInput = debounceFn(handleInput)
  const debouncedHandleBlur = debounceFn(handleBlur)
</script>

<input
  {type}
  {name}
  value={value ?? ''}
  checked={type === 'text' ? undefined : checkboxChecked}
  on:input={type === 'text' ? debouncedHandleInput : undefined}
  on:blur={type === 'text' ? debouncedHandleBlur : handleBlur}
  on:change={type === 'checkbox' ? handleChecked : type === 'radio' ? handleChange : undefined}
  class={className}
/>
