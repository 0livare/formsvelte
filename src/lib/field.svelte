<script lang="ts">
  import { getFormContext } from './context'
  import { debounceFn, getIn } from './utils'

  export let name: string
  export let type: 'text' | 'checkbox' | 'radio' = 'text'
  export let value: string | undefined = undefined
  let className: string | undefined = undefined
  export { className as class }

  const { handleInput, handleBlur, handleChecked, handleChange, values } = getFormContext<any>()

  $: determinedValue = getIn($values, name) ?? ''
  $: checkboxChecked =
    type === 'checkbox'
      ? Array.isArray(determinedValue)
        ? determinedValue.includes(value)
        : determinedValue
      : type === 'radio'
      ? determinedValue === value
      : undefined

  const debouncedHandleInput = debounceFn(handleInput)
  const debouncedHandleBlur = debounceFn(handleBlur)
</script>

<input
  {type}
  {name}
  value={type === 'text' ? determinedValue : value ?? ''}
  checked={checkboxChecked}
  on:input={type === 'text' ? debouncedHandleInput : undefined}
  on:blur={type === 'text' ? debouncedHandleBlur : handleBlur}
  on:change={type === 'checkbox' ? handleChecked : type === 'radio' ? handleChange : undefined}
  class={className}
/>
