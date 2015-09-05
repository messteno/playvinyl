'use strict';

var config     = require('../config');
var gulp       = require('gulp');
var gulpif     = require('gulp-if');
var streamify  = require('gulp-streamify');
var minifyHtml = require('gulp-minify-html');

// Views task
gulp.task('html', function() {

    return gulp.src(config.html.src)
    .pipe(gulpif(global.isProd, streamify(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))))
    .pipe(gulp.dest(config.html.dest));

});
