<script lang="ts">
  import { getFormContext } from './helpers'
  import { debounceFn } from './utils'

  export let name: string

  const { handleInput, handleBlur, errors } = getFormContext<any>()

  $: error = $errors[name]

  const debouncedHandleInput = debounceFn(handleInput)
  const debouncedHandleBlur = debounceFn(handleBlur)
</script>

<input type="text" {name} on:input={debouncedHandleInput} on:blur={debouncedHandleBlur} />

{#if error}
  <p class="error">{error}</p>
{/if}

<style>
  input {
    background: white;
    border-radius: 4px;
    font-size: 18px;
    margin-top: 64px;
    margin-left: 64px;
  }

  .error {
    color: red;
    font-weight: 700;
    margin-left: 64px;
  }
</style>
