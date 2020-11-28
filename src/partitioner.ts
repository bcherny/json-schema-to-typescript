import {AST, ASTWithStandaloneName, hasStandaloneName, traverse} from './types/AST'

export function partition(ast: AST): ASTWithStandaloneName[] {
  const standaloneDeclarations: ASTWithStandaloneName[] = []
  traverse(ast, _ => {
    if (!hasStandaloneName(_)) {
      return
    }
    if (!standaloneDeclarations.some(s => s.standaloneName === _.standaloneName)) {
      standaloneDeclarations.push(_)
    }
  })
  return standaloneDeclarations
}
