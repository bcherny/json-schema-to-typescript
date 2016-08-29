const dts = require('dts-bundle')
const gulp = require('gulp')
const lint = require('gulp-tslint')
const path = require('path')

function exec(what, args, cb) {
  what = `${__dirname}/node_modules/.bin/${what}${process.platform === 'win32' ? '.cmd' : ''}`
  require('child_process').exec(what + ' ' + args, function (err, stdout, stderr) {
    if (stdout) console.log(stdout)
    //if (stderr) console.log(stderr)
    cb(err)
  })
}

gulp.task('tsc', function (cb) {
  exec('tsc', '', cb)
})
gulp.task('browserify', function (cb) {
  exec('browserify', 'out/src/index.js --no-bundle-external -o dist/index.umd.js', cb)
})
gulp.task('test', ['tsc'], function (cb) {
  exec('mocha', '--colors out/test/test.js', cb)
})
gulp.task('lint', function () {
  gulp
    .src('./src/*.ts')
    .pipe(lint({formatter: 'verbose'}))
    .pipe(lint.report())
})
gulp.task('debug', ['tsc'], function (cb) {
  exec('mocha', '--nolazy --debug-brk --colors out/test/test.js', cb)
})

gulp.task('bundle', ['tsc'], function (cb) {
  dts.bundle({
    name: 'cool-project',
    main: 'out/src/index.d.ts',
    outputAsModuleFolder: true,
    out: path.join(__dirname, 'dist/index.d.ts')
  })
  exec('browserify', 'out/src/index.js --no-bundle-external -s json-schema-to-typescript -o dist/index.js', cb)
})
gulp.task('validate-bundle-typings', ['bundle'], function (cb) {
  exec('tsc', 'dist/index.d.ts --lib es6 --noEmit', cb)
})
gulp.task('dist', ['bundle', 'validate-bundle-typings'])
gulp.task('build', ['test', 'lint', 'dist'])
