<script lang="ts">
  import { getFormContext } from './context'
  import { debounceFn, getIn } from './utils'

  export let name: string
  export let type: 'text' | 'email' | 'password' | 'checkbox' | 'radio' | 'select' = 'text'
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

  function isTextInput() {
    return ['text', 'email', 'password'].includes(type)
  }
</script>

{#if type === 'select'}
  <select {name} value={determinedValue} on:change={handleChange} class={className}>
    <slot />
  </select>
{:else}
  <input
    {type}
    {name}
    value={isTextInput() ? determinedValue : value ?? ''}
    checked={checkboxChecked}
    on:input={isTextInput() ? debouncedHandleInput : undefined}
    on:blur={isTextInput() ? debouncedHandleBlur : handleBlur}
    on:change={type === 'checkbox' ? handleChecked : type === 'radio' ? handleChange : undefined}
    class={className}
  />
{/if}
