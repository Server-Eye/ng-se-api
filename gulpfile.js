'use strict';

var del = require('del'),
    gulp = require('gulp'),
    bundle = require('gulp-bundle-assets');

gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['./dist/**/*'], cb);
});

gulp.task('bundle', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['bundle']);