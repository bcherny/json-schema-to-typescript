declare module 'fast-diff' {
  export = diff
  namespace diff {
    export const INSERT = 1
    export const EQUAL = 0
    export const DELETE = -1

    export type DeleteEdit = [-1, string]
    export type EqualEdit = [0, string]
    export type InsertEdit = [1, string]
    export type Edit = DeleteEdit | EqualEdit | InsertEdit
  }

  function diff(a: string, b: string): diff.Edit[]
}
