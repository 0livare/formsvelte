# Formsvelte

A complete form solution for Svelte, with an API inspired by [Formik](https://formik.org).

This project is a work in progress.

## Install

```bash
# Install with npm
npm i formsvelte

# Or install with yarn
yarn add formsvelte
```

## Why?

Svelte has great built in bindings that make working with inputs much simpler than doing so would be in React (for example). But it's missing a solution for validation and error handling.

That's where Formsvelte comes in! By creating a validation schema, you can describe the rules of your form and the error messages that should be displayed when those rules aren't met. Formsvelte then takes those rules, makes sure they're followed, and displays your error message when they're not.

## Example

```svelte
<script>
  import {Formsvelte, Form, Field, Error} from 'formsvelte'
  import { string, object } from 'yup'

  const schema = object().shape({
    username: string()
      .email()
      .required('Please enter username'),
    password: string()
      .min(12, 'Password must be at least 12 characters')
      .required('Please enter a password')
  })
</script>

<Formsvelte
  initialValues={{ username: '', password: '' }}
  yupSchema={schema}
  onSubmit={(values) => alert(`Submitted!\n${JSON.stringify(values, null, 2)}`)}
>
  <Form>
    <div>
      <Field type="text" name="username" />
      <Error name="username" />
    </div>

    <div>
      <Field type="password" name="password" />
      <Error name="password" />
    </div>

    <button>Submit</button>
  </Form>
</Formsvelte>
```

## API

### &lt;Formsvelte&gt;

The root of every Formsvelte form that supplies context to the rest of the components.

| Prop name       | Type                  | Default   | Required? | Description                                                                                                                                 |
| --------------- | --------------------- | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialValues` | `T`                   | -         | **Yes**   | The initial set of values for your form. The shape of this object should correspond to the `name`s of the `Field`s in your form.            |
| `onSubmit`      | `(values: T) => void` | -         | **Yes**   | Callback invoked when the form is submitted                                                                                                 |
| `yupSchema`     | `AnySchema`           | undefined | No        | A [Yup](https://github.com/jquense/yup) schema used to validate your form. Schema libraries other than Yup will be supported in the future. |

### &lt;Form&gt;

A replacement for the native `<form>` element, this component is necessary to capture the submit event. It takes no props other than an optional `class`.

### &lt;Field&gt;

Every instance of `Field` renders an input of some kind. The type of that input is determined by the `type` prop.

| Prop name | Type                                                                   | Default   | Required? | Description                                                                                                      |
| --------- | ---------------------------------------------------------------------- | --------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| `name`    | string                                                                 | -         | **Yes**   | The name of the input. This should map to the shape of a key within `Formsvelte.initialValues` via dot notation. |
| `type`    | `'text' \| 'checkbox' \| 'radio' \| 'select' \| 'email' \| 'password'` | -         | **Yes**   | The type of input to render. `type == 'select'` accepts a default slot of `<option>`s.                           |
| `value`   | string                                                                 | undefined | No        | The value of this input. Typically only necessary for radio groups and checkbox groups.                          |

### &lt;Error&gt;

Display an error message from your validation schema when the rules of the schema are not met.

| Prop name | Type   | Default | Required? | Description                                                                                                                                                |
| --------- | ------ | ------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`    | string | -       | **Yes**   | The name of the input (or group) that this error corresponds to. This should map to the shape of a key within `Formsvelte.initialValues` via dot notation. |

## More Examples

### Checkbox

The value for a checkbox is just a boolean.

```svelte
<script>
  const schema = object().shape({terms: boolean().isTrue()})
</script>

<Formsvelte
  initialValues={{terms: false}}
  yupSchema={schema}
>
  <Form>
    <Field type="checkbox" name="terms" />
    <Error type="terms">
  </Form>
</Formsvelte>
```

### Radio Button Group

Notice that each of the radio inputs has the same `name` prop but different `value` props. When submitted, `values[name]` will have the `value` of the selected radio button. In this example, `values.scoops` will have 1, 2, or 3 as its value (the validation schema prevents 4 from being chosen).

```svelte
<script>
  const schema = object().shape({
    scoops: number().min(1).max(3).required(),
  })
</script>

<Formsvelte
  initialValues={{scoops: ''}}
  yupSchema={schema}
>
  <Form>
      <label>
        <Field type="radio" name="scoops" value="1" />
        One
      </label>
      <label>
        <Field type="radio" name="scoops" value="2" />
        Two
      </label>
      <label>
        <Field type="radio" name="scoops" value="3" />
        Three
      </label>
      <label>
        <Field type="radio" name="scoops" value="4" />
        Four
      </label>
      <Error name="scoops" />
  </Form>
</Formsvelte>
```

### Select

For selects, the `<option>`s are passed to the default slot of `<Field>`.

```svelte
<script>
  const schema = object().shape({
    car: string().oneOf(['mercedes', 'audi']).required(),
  })
</script>

<Formsvelte
  initialValues={{car: ''}}
  yupSchema={schema}
>
  <Form>
    <Field type="select" name="car">
      <option value="">-</option>
      <option value="volvo">Volvo</option>
      <option value="saab">Saab</option>
      <option value="mercedes">Mercedes</option>
      <option value="audi">Audi</option>
    </Field>
    <Error name="car" />
  </Form>
</Formsvelte>
```

### Checkbox Group

Notice that each of the checkboxes in the group has the same `name` prop but different `value` props. When submitted, `values[name]` will be an array of the `value`s of the selected checkboxes; this is different from a single checkbox whose value is a single boolean.

```svelte
<script>
  const schema = object().shape({
    flavors: array()
      .of(string().oneOf(['vanilla', 'strawberry']))
      .min(1)
      .required(),
  })
</script>

<Formsvelte
  initialValues={{flavors: []}}
  yupSchema={schema}
>
  <Form>
    <label>
      <Field type="checkbox" name="flavors" value="vanilla" />
      Vanilla
    </label>
    <label>
      <Field type="checkbox" name="flavors" value="chocolate" />
      Chocolate
    </label>
    <label>
      <Field type="checkbox" name="flavors" value="strawberry" />
      Strawberry
    </label>
    <Error name="flavors" />
  </Form>
</Formsvelte>
```

### Nested objects

Arbitrary levels of nesting are supported via dot notation in the `name` prop of `Field`s and `Error`s.

```svelte
<script>
  const schema = object().shape({
    foo: object().shape({
      name: string().required('You forgot this one'),
      terms: boolean().isTrue('Please accept terms').required('Accept my terms or else'),
    }),
  })
</script>

<Formsvelte
  initialValues={{foo: {name: '', terms: false}}}
  yupSchema={schema}
>
  <Form>
    <div>
      <label>
        What's your name?
        <Field type="text" name="foo.name" />
      </label>
      <Error name="foo.name" />
    </div>

    <div>
      <label>
        <Field type="checkbox" name="foo.terms" />
        Please accept the terms & conditions
      </label>
      <Error name="foo.terms" />
    </div>
  </Form>
</Formsvelte>
```

## FAQ

### Svelte throws a linting error about labels being associated with a control

```
A11y: A form label must be associated with a control.
svelte(a11y-label-has-associated-control)
```

Svelte doesn't know that `Field` renders an input, so it's mad that you're using a `<label>` without an input.

The easiest way I've [found](https://github.com/sveltejs/svelte/issues/5300#issuecomment-985466867) to address this is to add `for={undefined}` to the label.

```svelte
<label for={undefined}>
  What is your name?
  <Field type="text" name="name" class="textbox" />
</label>
```
