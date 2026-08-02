/**
 * Memoizes a function on its first argument, which must be an object.
 *
 * lodash's `memoize` backs its cache with a native `Map`, but only if it can
 * convince itself that `Map` is native: it builds a regex out of
 * `Function.prototype.toString.call(Object.prototype.hasOwnProperty)` and tests
 * `Map`'s source against it. Bun prints the two in different shapes --
 * `hasOwnProperty` over three lines, `Map` on one -- so the check fails and the
 * cache degrades to a list that is scanned linearly on every read. Compiling a
 * large schema goes from seconds to minutes. (`Set`, `WeakMap` and `DataView`
 * fail the same check, so lodash's `Stack`, and therefore `cloneDeep`, is
 * slower under bun too.)
 *
 * A `WeakMap` is what we want here anyway: keys are schema/AST nodes, and the
 * cache should die with them.
 *
 * Like lodash, only the first argument takes part in the cache key.
 */
export function memoize<A extends object, B extends unknown[], C>(
  fn: (a: A, ...rest: B) => C,
): (a: A, ...rest: B) => C {
  const cache = new WeakMap<A, C>()
  return (a, ...rest) => {
    if (cache.has(a)) {
      return cache.get(a) as C
    }
    const result = fn(a, ...rest)
    cache.set(a, result)
    return result
  }
}
