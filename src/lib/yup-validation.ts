import type { Writable } from 'svelte/store'
import type { AnySchema, ValidationError } from 'yup'

import type { Values } from './context'

export function validateSingleFieldWithYup<T, V>(args: {
  schema: AnySchema
  name: string
  values: Values<T, V>
  errors: Writable<any>
}) {
  const { schema, name, values, errors } = args
  try {
    schema.validateSyncAt(name as string, values)
    errors.update((errors) => {
      delete errors[name]
      return errors
    })
  } catch (e) {
    const formErrors = convertYupError(e as Error)
    errors.update((errors) => {
      errors[name] = formErrors[name]
      return errors
    })
  }
}

export function validateSchemaWithYup<T, V>(args: {
  schema: AnySchema
  values: Values<T, V>
  errors: Writable<any>
}) {
  const { schema, values, errors } = args
  try {
    schema.validateSync(values, { abortEarly: false })
    errors.set({})
  } catch (e) {
    const formErrors = convertYupError(e as Error)
    errors.set(formErrors)
  }
}

function convertYupError(e: Error) {
  const errors: Record<string, string> = {}

  // Yup will throw a validation error if validation fails. We catch those and
  // resolve them into Formik errors. We can sniff if something is a Yup error
  // by checking error.name.
  // @see https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
  if (e.name === 'ValidationError') {
    const outerError = e as ValidationError

    const individualErrors = outerError.inner
    if (!individualErrors) return {}

    // Formik's impl here: https://github.com/jaredpalmer/formik/blob/e677bea8181f40e6762fc7e7fb009122384500c6/packages/formik/src/Formik.tsx#L1047
    if (outerError.inner.length === 0) {
      setError({ errors, error: outerError })
    }

    for (const individualError of individualErrors) {
      if (errors[individualError.path!]) continue
      setError({ errors, error: individualError })
    }
  } else {
    // We throw any other errors
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `Warning: An unhandled error was caught during validation in <Formsvelte yupSchema />`,
        e,
      )
    }
  }

  return errors
}

function setError(args: { errors: Record<string, string>; error: ValidationError }) {
  const { error, errors } = args

  let path = error.path ?? ''
  const match = path.match(/(.+)\[\d+\]$/)
  if (match) path = match[1]

  errors[path] = error.message
}
