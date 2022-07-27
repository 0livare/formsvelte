<script lang="ts">
  import { getFormContext } from './context'

  export let name: string
  let className: string | undefined = undefined
  export { className as class }

  const { errors } = getFormContext<any>()
  $: error = $errors[name]
</script>

{#if error}
  <p class={className}>{error}</p>
{/if}
