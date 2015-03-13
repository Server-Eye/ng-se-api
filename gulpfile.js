'use strict';

var browserify = require('browserify'),
    del = require('del'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    header = require('gulp-header'),
    sourcemaps = require('gulp-sourcemaps');

var pkgInfo = require('./package.json');

function getBundleName(minify) {
    var name = pkgInfo.name;
    return name + (minify ? '.' + 'min' : '');
}

function getHeader() {
    return [ 
        '/**', 
        ' * <%= name %>', 
        ' * @version <%= version %>', 
        ' * @link <%= repository.url %>', 
        ' * @license <%= license %>', 
        ' */'
    ].join('\n');
}

gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['dist'], cb);
});

gulp.task('javascript', ['clean'], function () {
    var bundler = browserify({
        basedir: './src',
        entries: [
            './module.js', './config.js', './request.js',
            './agent/agent.js', './agent/misc.js', './agent/note.js', './agent/notification.js', './agent/setting.js', './agent/state.js', './agent/type.js',
            './auth/auth.js',
            './container/container.js', './container/misc.js', './container/note.js', './container/notification.js', './container/proposal.js', './container/state.js', './container/template.js',
            './customer/customer.js', './customer/setting.js', './customer/dispatchTime.js', './customer/tag.js',
            './me/me.js', './me/mobilepush.js', './me/notification.js',
            './group/group.js', './group/setting.js', './group/user.js',
            './user/user.js', './user/setting.js', './user/group.js', './user/substitude.js'
        ],
        debug: true
    });

    var minify = function () {
        return bundler
            .bundle()
            .pipe(source(getBundleName(true) + '.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            // Add transformation tasks to the pipeline here.
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(header(getHeader(), pkgInfo))
            .pipe(gulp.dest('./dist/js/'));
    };
    
    var bundle = function () {
        return bundler
            .bundle()
            .pipe(source(getBundleName(false) + '.js'))
            .pipe(buffer())
            .pipe(header(getHeader(), pkgInfo))
            .pipe(gulp.dest('./dist/js/'));
    };

    minify();
    bundle();
});

gulp.task('default', ['javascript']);
