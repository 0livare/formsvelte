<script>
  import { string, object } from 'yup'

  import Formsvelte from '$lib/formsvelte.svelte'
  import Field from '$lib/field.svelte'
  import Form from '$lib/form.svelte'
  import Error from '$lib/error.svelte'

  const schema = object().shape({
    username: string().email().required('Please enter username'),
    password: string()
      .min(12, 'Password must be at least 12 characters')
      .required('Please enter a password'),
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
