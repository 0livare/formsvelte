<script lang="ts">
  import Formsvelte from '$lib/formsvelte.svelte'
  import Field from '$lib/field.svelte'
  import { string, object, boolean } from 'yup'

  const schema = object().shape({
    foo: string().matches(/zach/, 'Wrong name'),
    bar: boolean().isTrue('Please accept terms'),
  })
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<Formsvelte
  initialValues={{ foo: '', bar: false }}
  onSubmit={(values) => console.log('Submitted!', values)}
  yupSchema={schema}
>
  <Field type="text" name="foo" />
  <Field type="checkbox" name="bar" />
</Formsvelte>
