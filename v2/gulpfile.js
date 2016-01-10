var path = require('path');
var gulp = require('gulp');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var concat = require('gulp-concat');
var changed = require('gulp-changed');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var templateCache = require('gulp-angular-templatecache');
var rename = require("gulp-rename");

gulp.task('angular-cache', ['minify-html'], function() {
  gulp.src('dist/{templates,partials}/*.html')
    .pipe(templateCache())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('angular-concat-cache', ['angular-cache'], function () {
  gulp.src(['dist/js/app_no_cache.js', 'dist/js/templates.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('minify-js', function() {
  return gulp.src(['public/js/**/*.js', '!public/js/libraries/*.js'])
    .pipe(changed('dist/'))
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename = path.basename.replace("app", "app_no_cache");
      return path;
    }))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('minify-css', function() {
  return gulp.src('public/css/**/*.css')
    .pipe(changed('dist/'))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('minify-html', function() {
   return gulp.src('public/**/*.html')
    .pipe(changed('dist/'))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy-files', function () {
  gulp.src('public/images/*').pipe(gulp.dest('dist/images/'));
  gulp.src('public/js/libraries/*.js').pipe(gulp.dest('dist/js/libraries/'));
});

gulp.task('default', function() {
  gulp.run('minify-js', 'minify-css', 'minify-html', 'copy-files', 'angular-cache', 'angular-concat-cache');
});