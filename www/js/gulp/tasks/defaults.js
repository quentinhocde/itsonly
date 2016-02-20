var gulp = require('gulp');

gulp.task('build', function() {

	

	gulp.watch('styles/sass/**/*.scss',['styles','autoprefixer']);
	gulp.watch('js/*.js',['babel']);
	
	browserSync.init({
    	server: "./"
	});
	
});

gulp.task('default', ['build']);

