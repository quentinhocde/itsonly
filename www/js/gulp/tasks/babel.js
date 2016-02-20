var gulp = require('gulp')
    browserify = require('browserify')
    babelify= require('babelify')
    util = require('gulp-util')
    buffer = require('vinyl-buffer')
    source = require('vinyl-source-stream')
    uglify = require('gulp-uglify')
    sourcemaps = require('gulp-sourcemaps')
    browserSync = require('browser-sync').create();
    
gulp.task('babel', function() {
    browserify('./js/App.js', { debug: true })
    	.add(require.resolve('babel/polyfill'))
    	.transform(babelify)
    	.bundle()
    	.on('error', util.log.bind(util, 'Browserify Error'))
    	.pipe(source('bundle.js'))
    	.pipe(buffer())
    	.pipe(sourcemaps.init({loadMaps: true}))
    	.pipe(uglify({ mangle: false }))
    	.pipe(sourcemaps.write('./'))
    	.pipe(gulp.dest('./js/dist'))
        .pipe(browserSync.stream());

});


gulp.task('babel-prod', function() {
    browserify('./js/App.js', { debug: true })
    	.add(require.resolve('babel/polyfill'))
    	.transform(babelify)
    	.bundle()
    	.on('error', util.log.bind(util, 'Browserify Error'))
    	.pipe(source('bundle.js'))
    	.pipe(buffer())
    	.pipe(uglify({ mangle: false }))
    	.pipe(sourcemaps.write('./'))
    	.pipe(gulp.dest('./js/dist'));
});