export abstract class TsType {
  abstract toString(): string
}
export class Any extends TsType {
  toString() {
    return 'any'
  }
}
export class Array extends TsType {
  constructor(private type?: TsType) { super() }
  toString() {
    return `${this.type ? this.type.toString() : (new Any()).toString()}[]`
  }
}
export class Boolean extends TsType {
  toString() {
    return 'boolean'
  }
}
export class Class extends TsType {
  constructor(private name: string) { super() }
  toString() {
    return this.name
  }
}
export class Intersection extends TsType {
  constructor(private data: TsType[]) { super() }
  toString() {
    return this.data.join('&')
  }
}
export class Literal extends TsType {
  constructor(private value: any) { super() }
  toString() {
    return this.value
  }
}
export class Number extends TsType {
  toString() {
    return 'number'
  }
}
export class Object extends TsType {
  toString() {
    return 'Object'
  }
}
export class String extends TsType {
  toString() {
    return 'string'
  }
}
export class Union extends TsType {
  constructor(private data: TsType[]) { super() }
  toString() {
    return this.data.join('|')
  }
}
export class Void extends TsType {
  toString() {
    return 'void'
  }
}

export class InterfaceProperty extends TsType {
  constructor(private data: {
    isRequired: boolean,
    key: string,
    value: TsType,
    description?: string
  }) { super() }
  toString(): string {
    return [
      this.data.key,
      `${this.data.isRequired ? '' : '?'}: `,
      `${this.data.value.toString()};`,
      this.data.description ? ` // ${this.data.description}` : ''
    ].join('')
  }
}

export class Interface extends TsType {
  constructor(private data: {name: string, description?: string, props: InterfaceProperty[]}) {
    super()
  }
  get name (){ return this.data.name }
  private toBlockComment(a: string) {
    return `/*
    ${a}
  */
    `
  }
  toString(): string {
    return `${
        this.data.description
        ? this.toBlockComment(this.data.description)
        : ''
      }interface ${this.data.name} {
        ${this.data.props.join('\n')}
      }`
  }
}