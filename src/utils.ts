// TODO: pull out into a separate package
export function Try<T>(fn: () => T, err: (e: Error) => any): T {
  try {
    return fn()
  } catch (e) {
    return err(e as Error)
  }
}
