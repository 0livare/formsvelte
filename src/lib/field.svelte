<script lang="ts">
  import { getFormContext, type ChangeEvent } from './helpers'
  import { debounceFn } from './utils'

  export let name: string

  const { handleInput, handleBlur } = getFormContext()

  const debouncedHandleInput = debounceFn(handleInput)
  const debouncedHandleBlur = debounceFn(handleBlur)
</script>

<input type="text" {name} on:input={debouncedHandleInput} on:blur={debouncedHandleBlur} />
