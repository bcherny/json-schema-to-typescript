// Piped and file inputs under this directory resolve their Prettier config here,
// not at the repo root's own .prettierrc, so the CLI tests format with the
// library defaults.
module.exports = require('../../dist/src').DEFAULT_OPTIONS.style
