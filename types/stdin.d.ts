declare module 'stdin' {
  export = stdin
  function stdin(fn: (str: string) => any): void
}
