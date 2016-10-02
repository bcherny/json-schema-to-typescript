import { camelCase, upperFirst } from 'lodash'

// TODO: pull out into a separate package
export function tryFn<T>(fn: () => T, err: (e: Error) => any): T {
  try {
    return fn()
  } catch (e) {
    return err(e as Error)
  }
}

// eg.
//   foo -> Foo
//   fooBar -> FooBar
//   foo_1bar -> Foo_1bar
// TODO: more safety
// TODO: unit tests
export function nameToTsSafeName(name: string): string {
  return upperFirst(camelCase(name))
}
