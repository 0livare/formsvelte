import { getContext, setContext } from 'svelte'
import { type Writable, type Readable } from 'svelte/store'
import type { AnySchema, ValidationError } from 'yup'
import { getIn, setIn, setInStore } from './utils'

export const key = Symbol()

export type ChangeEvent = Event & {
  target: EventTarget & HTMLInputElement
  currentTarget: EventTarget & HTMLInputElement
  checked: boolean
}

export type Values<T, V> = Partial<Record<keyof T, V>>

type FormContextShape<T> = {
  isDirty: Readable<boolean>
  submitCount: Readable<number>
  initialValues: T
  values: Readable<Values<T, string | boolean>>
  touched: Readable<Values<T, boolean>>
  errors: Readable<Values<T, string>>
  handleInput: (e: Event) => void
  handleBlur: (e: Event) => void
  handleChecked: (e: Event) => void
  handleSubmit: () => void
}

export function getFormContext<T>() {
  return getContext<FormContextShape<T>>(key)
}

export function setFormContext<T>(formContext: FormContextShape<T>) {
  setContext(key, formContext)
}

export function validateSingleField<T, V>(args: {
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
    const err = e as ValidationError

    // Yup will throw a validation error if validation fails. We catch those and
    // resolve them into Formik errors. We can sniff if something is a Yup error
    // by checking error.name.
    // @see https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
    if (err.name === 'ValidationError') {
      // Formik's impl here: https://github.com/jaredpalmer/formik/blob/e677bea8181f40e6762fc7e7fb009122384500c6/packages/formik/src/Formik.tsx#L1047
      if (err.inner) {
        if (err.inner.length === 0) {
          setInStore(errors, err.path, err.message)
        }
        for (const innerErr of err.inner) {
          errors.update((errors) => {
            if (!getIn(errors, innerErr.path)) {
              errors = setIn(errors, innerErr.path, innerErr.message)
            }
            return errors
          })
        }
      }
    } else {
      // We throw any other errors
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `Warning: An unhandled error was caught during validation in <Formik validationSchema />`,
          err,
        )
      }
    }
  }
}
