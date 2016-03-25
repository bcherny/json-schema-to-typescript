require('colors')
const diffChars = require('diff').diffChars

module.exports.diff = function diff (a, b) {
  diffChars(
      showControlChars(a.toString()),
      showControlChars(b.toString()),
      {ignoreWhitespace: false}
    )
    .forEach(part => {
      const color = part.added
        ? 'green'
        : part.removed
          ? 'red'
          : 'grey'
      process.stderr.write(part.value[color])
    })
}

function showControlChars (a) {
  return a.replace('\n', '\\N').replace('\r', '\\R')
}