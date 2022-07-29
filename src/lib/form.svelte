<script lang="ts">
  import { getFormContext } from './context'
  const { handleSubmit } = getFormContext<any>()

  let className: string | undefined = undefined
  export { className as class }
</script>

<form on:submit={handleSubmit} class={className}>
  <slot />
</form>
