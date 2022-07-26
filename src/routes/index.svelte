<script lang="ts">
  import Formsvelte from '$lib/formsvelte.svelte'
  import Field from '$lib/field.svelte'
  import Form from '$lib/form.svelte'
  import Error from '$lib/error.svelte'
  import { string, object, boolean, array, number } from 'yup'

  const schema = object().shape({
    foo: object().shape({
      name: string()
        .matches(/^zach$/i, 'Wrong name')
        .required('You forgot this one'),
      terms: boolean().isTrue('Please accept terms').required('Accept my terms or else'),
    }),
    flavors: array()
      .of(string().oneOf(['vanilla', 'chocolate']))
      .min(1)
      .required(),
    scoops: number().min(1).max(3).required(),
  })
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<Formsvelte
  initialValues={{ foo: { name: '', terms: false }, flavors: [], scoops: null }}
  onSubmit={(values) => console.log('Submitted!', values)}
  yupSchema={schema}
>
  <Form>
    <label for={undefined}>
      What is your name?
      <Field type="text" name="foo.name" class="textbox" />
    </label>
    <Error name="foo.name" class="error" />

    <label for={undefined}>
      <Field type="checkbox" name="foo.terms" />
      Please accept the terms & conditions
    </label>
    <Error name="foo.terms" class="error" />

    <div class="group">
      <label for={undefined}>
        <Field type="radio" name="scoops" value="1" />
        One
      </label>
      <label for={undefined}>
        <Field type="radio" name="scoops" value="2" />
        Two
      </label>
      <label for={undefined}>
        <Field type="radio" name="scoops" value="3" />
        Three
      </label>
      <label for={undefined}>
        <Field type="radio" name="scoops" value="4" />
        Four
      </label>
      <Error name="scoops" class="error" />
    </div>

    <div class="group">
      <label for={undefined}>
        <Field type="checkbox" name="flavors" value="vanilla" />
        Vanilla
      </label>
      <label for={undefined}>
        <Field type="checkbox" name="flavors" value="chocolate" />
        Choclate
      </label>
      <label for={undefined}>
        <Field type="checkbox" name="flavors" value="strawberry" />
        Strawberry
      </label>
      <Error name="flavors" class="error" />
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

  :global(.error) {
    color: lightcoral;
    font-weight: 700;
  }

  :global(.textbox) {
    background: white;
    border-radius: 4px;
    font-size: 18px;
  }
</style>
