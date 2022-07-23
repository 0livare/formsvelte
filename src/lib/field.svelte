<script lang="ts">
  import { getFormContext } from './helpers'

  export let name: string

  const { register } = getFormContext()
  let input: HTMLInputElement | null = null
  $: if (input) register(input)
</script>

<input type="text" bind:this={input} {name} />
