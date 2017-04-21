import { run as runCLITests } from './testCLI'
import { run as runE2ETests } from './testE2E'
import { run as runNormalizerTests } from './testNormalizer'

runCLITests()
runE2ETests()
runNormalizerTests()
