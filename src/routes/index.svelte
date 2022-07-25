<script lang="ts">
  import Formsvelte from '$lib/formsvelte.svelte'
  import Field from '$lib/field.svelte'
  import Form from '$lib/form.svelte'
  import Error from '$lib/error.svelte'
  import { string, object, boolean, array } from 'yup'

  const schema = object().shape({
    foo: object().shape({
      name: string()
        .matches(/^zach$/i, 'Wrong name')
        .required('You forgot this one'),
      terms: boolean().isTrue('Please accept terms').required('Accept my terms or else'),
    }),
    choice: array().of(string().oneOf(['one', 'three'])),
  })
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<Formsvelte
  initialValues={{ foo: { name: '', terms: false }, choice: [] }}
  onSubmit={(values) => console.log('Submitted!', values)}
  yupSchema={schema}
>
  <Form>
    <Field type="text" name="foo.name" class="textbox" />
    <Error name="foo.name" class="error" />
    <Field type="checkbox" name="foo.terms" />
    <Error name="foo.terms" class="error" />

    <div class="group">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>
        <Field type="checkbox" name="choice" value="one" />
        One
      </label>
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>
        <Field type="checkbox" name="choice" value="two" />
        Two
      </label>
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>
        <Field type="checkbox" name="choice" value="three" />
        Three
      </label>

      <Error name="choice" class="error" />
    </div>

    <button>Submit!</button>
  </Form>
</Formsvelte>

<style>
  .group {
    border: 3px solid rebeccapurple;
  }

  label {
    display: flex;
  }

  .error {
    color: lightcoral;
    font-weight: 700;
  }

  .textbox {
    background: white;
    border-radius: 4px;
    font-size: 18px;
  }
</style>
