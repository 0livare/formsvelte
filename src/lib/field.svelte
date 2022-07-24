<script lang="ts">
  import { getFormContext } from './context'
  import { debounceFn, getIn, getInStore } from './utils'

  export let name: string
  export let type = 'text'

  const { handleInput, handleBlur, handleChecked, errors } = getFormContext<any>()

  $: error = getIn($errors, name)

  const debouncedHandleInput = debounceFn(handleInput)
  const debouncedHandleBlur = debounceFn(handleBlur)
</script>

<div class="root">
  <input
    {type}
    {name}
    on:input={type === 'text' ? debouncedHandleInput : undefined}
    on:blur={type === 'text' ? debouncedHandleBlur : handleBlur}
    on:change={type === 'checkbox' ? handleChecked : undefined}
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
