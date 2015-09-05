'use strict';

var config       = require('../config');
var gulp         = require('gulp');
var gulpif       = require('gulp-if');
var gutil        = require('gulp-util');
var source       = require('vinyl-source-stream');
var gzip         = require('gulp-gzip');
var sourcemaps   = require('gulp-sourcemaps');
var buffer       = require('vinyl-buffer');
var streamify    = require('gulp-streamify');
var watchify     = require('watchify');
var browserify   = require('browserify');
var babelify     = require('babelify');
var uglify       = require('gulp-uglify');
var handleErrors = require('../util/handleErrors');
var debowerify   = require('debowerify');
var ngAnnotate   = require('gulp-ng-annotate');
var size         = require('gulp-size');

// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildScript(src, dest) {

    var bundler = browserify({
        entries: [
            src
        ],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }, watchify.args);

    if (!global.isProd) {
        bundler = watchify(bundler);
        bundler.on('update', function() {
            rebundle();
        });
    }

    var transforms = [
        debowerify,
        'brfs',
        'bulkify'
    ];

    transforms.forEach(function(transform) {
        bundler.transform(transform);
    });

    function rebundle() {
        var stream = bundler.bundle();
        var createSourcemap = global.isProd && config.browserify.sourcemap;
        var start = new Date().getTime();

        gutil.log('Starting \'' + gutil.colors.cyan('rebundle ' + dest) + '\'...');

        return stream.on('error', handleErrors)
        .pipe(source(dest))
        .pipe(streamify(ngAnnotate()))
        .pipe(gulpif(createSourcemap, buffer()))
        .pipe(gulpif(createSourcemap, sourcemaps.init()))
        .pipe(gulpif(global.isProd, streamify(uglify({
            compress: { drop_console: true }
        }))))
        .pipe(streamify(size({
            title: dest,
        })))
        .pipe(gulpif(createSourcemap, sourcemaps.write('./')))
        .pipe(gulp.dest(config.scripts.dest))
        .pipe(gulpif(global.isProd, gzip(config.gzip.options)))
        .pipe(gulpif(global.isProd, gulp.dest(config.scripts.dest)))
        .on('finish', function() {
            var end = new Date().getTime();
            var time = end - start;
            gutil.log('Finished \'' + gutil.colors.cyan('rebundle ' + dest) + '\' after ' + gutil.colors.magenta(time + ' ms'));
        });
    }

    return rebundle();

}

gulp.task('browserify', function() {

    for (var i in config.browserify.entries) {
        buildScript(config.browserify.entries[i].src,
                    config.browserify.entries[i].dest);
    }

});
