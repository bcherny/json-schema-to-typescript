import { run as runCLITests } from './cli'
import { run as runE2ETests } from './e2e'
import { run as runNormalizerTests } from './normalizer'

runCLITests()
runE2ETests()
runNormalizerTests()
