import {run as runCLITests} from './testCLI'
import {run as runCompileFromFileTests} from './testCompileFromFile'
import {hasOnly, run as runE2ETests} from './testE2E'
import {run as runIdempotenceTests} from './testIdempotence'
import {run as runLinkerTests} from './testLinker'
import {run as runNormalizerTests} from './testNormalizer'
import {run as runUtilsTests} from './testUtils'

runE2ETests()

if (!hasOnly()) {
  runCompileFromFileTests()
  runCLITests()
  runIdempotenceTests()
  runLinkerTests()
  runNormalizerTests()
  runUtilsTests()
}
