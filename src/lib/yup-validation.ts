import type { Writable } from 'svelte/store'
import type { AnySchema, ValidationError } from 'yup'

import type { Values } from './context'
import { getIn, setIn, setInStore } from './utils'

export function validateSingleFieldWithYup<T, V>(args: {
  schema: AnySchema
  name: string
  values: Values<T, V>
  errors: Writable<any>
}) {
  const { schema, name, values, errors } = args
  try {
    schema.validateSyncAt(name as string, values)
    setInStore(errors, name, undefined)
  } catch (e) {
    const formErrors = convertYupError(e as Error)
    setInStore(errors, name, getIn(formErrors, name))
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
  let errors = {}

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
      return setIn(errors, outerError.path!, outerError.message)
    }

    for (const individualError of individualErrors) {
      if (getIn(errors, individualError.path!)) continue
      errors = setIn(errors, individualError.path!, individualError.message)
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
