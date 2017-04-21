import { run as runE2ETests } from './e2e'
import { run as runNormalizerTests } from './normalizer'

runNormalizerTests()
runE2ETests()
