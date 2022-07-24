<script lang="ts">
  import { getFormContext } from './context'
  const { handleSubmit } = getFormContext<any>()
</script>

<form on:submit={handleSubmit}>
  <slot />
</form>
