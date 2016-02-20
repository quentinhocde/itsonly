var gulp = require('gulp');

var requireDir = require('require-dir');
requireDir('./js/gulp/tasks', { recurse: true });


gulp.task('default', ['build']);

gulp.task('prod', function() {
 	gulp.watch('styles/sass/**/*.scss',['styles-prod']);
 	gulp.watch('js/*.js',['babel-prod']);


});
