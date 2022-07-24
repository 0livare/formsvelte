<script lang="ts">
  import Formsvelte from '$lib/formsvelte.svelte'
  import Field from '$lib/field.svelte'
  import Form from '$lib/form.svelte'
  import { string, object, boolean } from 'yup'

  const schema = object().shape({
    foo: object().shape({
      name: string()
        .matches(/^zach$/i, 'Wrong name')
        .required('You forgot this one'),
      terms: boolean().isTrue('Please accept terms').required('Accept my terms or else'),
    }),
  })
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<Formsvelte
  initialValues={{ foo: { name: '', terms: false } }}
  onSubmit={(values) => console.log('Submitted!', values)}
  yupSchema={schema}
>
  <Form>
    <Field type="text" name="foo.name" />
    <Field type="checkbox" name="foo.terms" />
    <button>Submit!</button>
  </Form>
</Formsvelte>
