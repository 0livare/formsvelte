<script lang="ts">
  import { getFormContext } from './context'
  import { getIn } from './utils'

  export let name: string
  let className: string | undefined = undefined
  export { className as class }

  const { errors } = getFormContext<any>()
  $: error = getIn($errors, name)
  $: console.log('error', $errors)
</script>

{#if error}
  <p class={className}>{error}</p>
{/if}
