const gulp = require('gulp');

function exec(what, args, cb) {
    what = `${__dirname}/node_modules/.bin/${what}${process.platform === 'win32' ? '.cmd' : ''}`; 
    require('child_process').exec(what + ' ' + args, function(err, stdout, stderr) {
        if (stdout) console.log(stdout);
        //if (stderr) console.log(stderr);
        cb(err);
    });
}

gulp.task('tsc', function(cb) {
    exec('tsc', '', cb);
});
gulp.task('test', ['tsc'], function(cb) {
    exec('mocha', '--colors out/test/test.js', cb);
});
gulp.task('debug', ['tsc'], function(cb) {
    exec('mocha', '--nolazy --debug-brk --colors out/test/test.js', cb);
});
gulp.task('dist', ['tsc'], function(cb) {
    return gulp.src('out/src/**').pipe(gulp.dest('dist'));
});
gulp.task('build', ['test', 'dist']);
