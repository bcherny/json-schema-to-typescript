/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/559
 * Regression guard, passes on master: a lone `patternProperties` entry becomes
 * the object's index signature, and with `strictIndexSignatures` it must get
 * `| undefined` like every other index signature. Broken up to 4eee0f1
 * (emitted `[k: string]: unknown[];`), fixed as a side effect of 107dd42
 * (#704, isIndexSignature flag on the synthesized param), unreleased as of
 * 15.0.4. PR #727 carries the root-level variant of the same check.
 */
export const input = {
  title: 'Experiment',
  type: 'object',
  properties: {
    pattern: {
      type: 'object',
      patternProperties: {
        'leaf|tree': {type: 'array'},
      },
    },
  },
}

export const options = {
  strictIndexSignatures: true,
}
