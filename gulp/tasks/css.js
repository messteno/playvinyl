'use strict';

var config       = require('../config');
var gulp         = require('gulp');
var sass         = require('gulp-ruby-sass');
var gulpif       = require('gulp-if');
var handleErrors = require('../util/handleErrors');
var autoprefixer = require('gulp-autoprefixer');
var streamify    = require('gulp-streamify');
var size         = require('gulp-size');
var concat       = require('gulp-concat');
var replace      = require('gulp-replace');

gulp.task('css', function () {

    return gulp.src(config.css.src)
    .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
    .pipe(streamify(size({
        title: 'css',
    })))
    .pipe(concat(config.css.out))
    .pipe(gulp.dest(config.css.dest));

});
