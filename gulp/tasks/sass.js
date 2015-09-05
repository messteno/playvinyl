'use strict';

var config       = require('../config');
var gulp         = require('gulp');
var sass         = require('gulp-ruby-sass');
var gulpif       = require('gulp-if');
var handleErrors = require('../util/handleErrors');
var autoprefixer = require('gulp-autoprefixer');
var streamify    = require('gulp-streamify');
var size         = require('gulp-size');
var replace      = require('gulp-replace');

gulp.task('sass', function () {

    return sass(config.sass.entry, {
        loadPath: [
            config.src.bower,
        ],
        style: global.isProd ? 'compressed' : 'nested',
        sourcemap: global.isProd,
    })
    .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
    .on('error', handleErrors)
    .pipe(replace('fonts/bootstrap', 'fonts'))
    .pipe(streamify(size({
        title: 'sass',
    })))
    .pipe(gulp.dest(config.sass.dest));

});
