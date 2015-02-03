'use strict';

var browserify = require('browserify'),
    del = require('del'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');

function getBundleName() {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    return name + '.' + 'min';
}

gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['dist'], cb);
});

gulp.task('javascript', ['clean'], function () {
    var bundler = browserify({
        basedir: './src',
        entries: [
            './module.js', './apiConfig.js', './request.js',
            './agent/agent.js', './agent/misc.js', './agent/note.js', './agent/notification.js', './agent/setting.js', './agent/state.js', './agent/type.js',
            './auth/auth.js',
            './container/container.js', './container/misc.js', './container/note.js', './container/notification.js', './container/proposal.js', './container/state.js', './container/template.js',
            './customer/customer.js', './customer/setting.js', './customer/dispatchTime.js',
            './me/me.js', './me/mobilepush.js', './me/notification.js',
            './group/group.js', './group/setting.js', './group/user.js',
            './user/user.js', './user/setting.js', './user/group.js', './user/substitude.js'
        ],
        debug: true
    });

    var bundle = function () {
        return bundler
            .bundle()
            .pipe(source(getBundleName() + '.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            // Add transformation tasks to the pipeline here.
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/js/'));
    };

    return bundle();
});

gulp.task('default', ['javascript']);
