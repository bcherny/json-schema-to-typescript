import {run as runCLITests} from './testCLI.js'
import {run as runCompileFromFileTests} from './testCompileFromFile.js'
import {hasOnly, run as runE2ETests} from './testE2E.js'
import {run as runIdempotenceTests} from './testIdempotence.js'
import {run as runLinkerTests} from './testLinker.js'
import {run as runNormalizerTests} from './testNormalizer.js'
import {run as runUtilsTests} from './testUtils.js'

runE2ETests()

if (!hasOnly()) {
  runCompileFromFileTests()
  runCLITests()
  runIdempotenceTests()
  runLinkerTests()
  runNormalizerTests()
  runUtilsTests()
}
