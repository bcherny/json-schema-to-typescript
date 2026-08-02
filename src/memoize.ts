/**
 * Memoizes a function on its first argument, which must be an object.
 *
 * lodash's `memoize` looks up its cache with a native `Map` when it can detect
 * one, and falls back to a list that it scans linearly when it can't. Bun
 * trips that detection, so every cache read walks the whole cache -- compiling
 * a large schema goes from seconds to minutes. A `WeakMap` is what we want
 * anyway: keys are schema/AST nodes, and the cache dies with them.
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
