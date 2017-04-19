declare module 'json-stringify-safe' {
  export = stringify
  function stringify(
    value: any,
    replacer?: (key: string, value: any) => any,
    space?: string | number,
    cycleReplacer?: (key: string, value: any) => string
  ): string | undefined
}
