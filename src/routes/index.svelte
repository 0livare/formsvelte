<script context="module" lang="ts">
  export const prerender = true
</script>

<script lang="ts">
  import Counter from '$lib/Counter.svelte'
  import Formsvelte from '$lib/formsvelte.svelte'
  import Field from '$lib/field.svelte'
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<Counter />

<Formsvelte initialValues={{ foo: '' }} onSubmit={(values) => console.log('Submitted!', values)}>
  <Field name="foo" />
</Formsvelte>
