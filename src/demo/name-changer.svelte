<script lang="ts">
  import { getFormContext } from '$lib/context'

  type FormShape = {
    foo: {
      name: string
      terms: boolean
    }
    scoops: number
    flavors: string[]
  }

  const { values } = getFormContext<FormShape>()

  function handleClick() {
    values.update((form) => {
      form.foo.name = `Lola ${Math.floor(Math.random() * 100)}`
      form.flavors.push('vanilla')
      return form
    })
  }
</script>

<button type="button" on:click={handleClick}>Change name</button>
