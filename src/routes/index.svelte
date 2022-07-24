<script lang="ts">
  import Formsvelte from '$lib/formsvelte.svelte'
  import Field from '$lib/field.svelte'
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<Formsvelte
  initialValues={{ foo: '', bar: '' }}
  onSubmit={(values) => console.log('Submitted!', values)}
>
  <Field type="text" name="foo" />
  <Field type="checkbox" name="bar" />
</Formsvelte>
