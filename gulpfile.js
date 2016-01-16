// Load required gulp plugins
var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var changed = require('gulp-changed');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var templateCache = require('gulp-angular-templatecache');
var rename = require('gulp-rename');
var nodemon = require('nodemon');

// Create a javascript file with all templates and partials
// loaded in $templateCache for use by angular
gulp.task('angular-cache', ['minify-html'], function() {
	gulp.src('dist/{templates,partials}/*.html')
		.pipe(templateCache())
		.pipe(gulp.dest('dist/js/'));
});

// Concatenate cached templates and partials into the main app.js file
gulp.task('angular-concat-cache', ['angular-cache'], function () {
	gulp.src(['dist/js/app_no_cache.js', 'dist/js/templates.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('dist/js/'));
});

// Copy and minify all javascript files that have been changed
gulp.task('minify-js', function() {
	return gulp.src(['public/js/**/*.js', '!public/js/libraries/*.js'])
		.pipe(changed('dist/'))
		.pipe(uglify())
		.pipe(rename(function (path) {
			// Rename app.js to app_no_cache.js for concatenation
			path.basename = path.basename.replace("app", "app_no_cache");
			return path;
		}))
		.pipe(gulp.dest('dist/js/'));
});

// Copy and minify all css files that have been changed
gulp.task('minify-css', function() {
	return gulp.src('public/css/**/*.css')
		.pipe(changed('dist/'))
		.pipe(minifyCss())
		.pipe(gulp.dest('dist/css/'));
});

// Copy and minify all html files that have been changed
gulp.task('minify-html', function() {
	 return gulp.src('public/**/*.html')
		.pipe(changed('dist/'))
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('dist/'));
});

// Copy any remaining files (images and javascript libraries) that dont need minification
gulp.task('copy-files', function () {
	gulp.src('public/images/**/*').pipe(gulp.dest('dist/images/'));
	gulp.src('public/js/libraries/**/*').pipe(gulp.dest('dist/js/libraries/'));
});

// Run nodejs server
gulp.task('run-server', ['build'], function () {
	nodemon({
		script: 'app.js',
		ext: 'js'
	});
});

// Build production site
gulp.task('build', function () {
	gulp.start('minify-js', 'minify-css', 'minify-html', 'copy-files', 'angular-cache', 'angular-concat-cache');
});

// Default task runs all the above tasks
gulp.task('default', function() {
	// Fire up the server
	gulp.start('run-server');
});