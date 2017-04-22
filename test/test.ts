import { run as runCLITests } from './testCLI'
import { hasOnly, run as runE2ETests } from './testE2E'
import { run as runNormalizerTests } from './testNormalizer'

runE2ETests()

if (!hasOnly()) {
  runCLITests()
  runNormalizerTests()
}
