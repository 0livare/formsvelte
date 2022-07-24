<script lang="ts">
  import { getFormContext } from './context'
  import { debounceFn, getIn, getInStore } from './utils'

  export let name: string
  export let type: 'text' | 'checkbox' | 'radio' = 'text'
  export let value: string | undefined = undefined

  const { handleInput, handleBlur, handleChecked, handleChange, errors, values } =
    getFormContext<any>()

  $: error = getIn($errors, name)
  $: determinedValue = getIn($values, name) ?? ''
  $: checkboxChecked = Array.isArray(determinedValue)
    ? determinedValue.includes(value)
    : determinedValue

  const debouncedHandleInput = debounceFn(handleInput)
  const debouncedHandleBlur = debounceFn(handleBlur)
</script>

<div class="root">
  <input
    {type}
    {name}
    value={value ?? ''}
    checked={type === 'text' ? undefined : checkboxChecked}
    on:input={type === 'text' ? debouncedHandleInput : undefined}
    on:blur={type === 'text' ? debouncedHandleBlur : handleBlur}
    on:change={type === 'checkbox' ? handleChecked : type === 'radio' ? handleChange : undefined}
  />

  {#if error}
    <p class="error">{error}</p>
  {/if}
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid rebeccapurple;
    padding-top: 64px;
    padding-left: 64px;
  }

  input {
    background: white;
    border-radius: 4px;
    font-size: 18px;
  }

  .error {
    color: red;
    font-weight: 700;
  }
</style>
