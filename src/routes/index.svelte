<script lang="ts">
  import { string, object, boolean, array, number } from 'yup'

  import Formsvelte from '$lib/formsvelte.svelte'
  import Field from '$lib/field.svelte'
  import Form from '$lib/form.svelte'
  import Error from '$lib/error.svelte'
  import NameChanger from '../demo/name-changer.svelte'

  const schema = object().shape({
    foo: object().shape({
      name: string()
        .matches(/^zach$/i, 'Name must be of the coolest person')
        .required('You forgot this one'),
      terms: boolean().isTrue('Please accept terms').required('Accept my terms or else'),
    }),
    flavors: array()
      .of(string().oneOf(['vanilla', 'strawberry']))
      .min(1)
      .required(),
    scoops: number().min(1).max(3).required(),
    car: string().oneOf(['mercedes', 'audi']).required(),
    people: array().of(
      object().shape({
        firstName: string().required(),
        lastName: string().required(),
      }),
    ),
  })
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<Formsvelte
  initialValues={{
    foo: { name: 'kiermo', terms: false },
    flavors: [],
    scoops: null,
    car: '',
    people: [{ firstName: '', lastName: '' }],
  }}
  onSubmit={(values) => console.info('Submitted!', values)}
  yupSchema={schema}
  let:values
>
  <Form>
    <div class="group">
      <label for={undefined}>
        What is your name?
        <Field type="text" name="foo.name" class="textbox" />
      </label>
      <Error name="foo.name" class="error" />
    </div>

    <div class="group">
      <label for={undefined}>
        <Field type="checkbox" name="foo.terms" />
        Please accept the terms & conditions
      </label>
      <Error name="foo.terms" class="error" />
    </div>

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
        Chocolate
      </label>
      <label for={undefined}>
        <Field type="checkbox" name="flavors" value="strawberry" />
        Strawberry
      </label>
      <Error name="flavors" class="error" />
    </div>

    <div class="group">
      <Field type="select" name="car">
        <option value="">-</option>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </Field>
      <Error name="car" class="error" />
    </div>

    <div class="group">
      {#each $values.people as person}{/each}
    </div>

    <NameChanger />
    <button>Submit!</button>
  </Form>
</Formsvelte>

<style>
  .group {
    border: 3px solid lightblue;
    margin: 16px 0px;
    padding: 8px;
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
