'use strict';

var config  = require('../config');
var changed = require('gulp-changed');
var gulp    = require('gulp');
var gulpif  = require('gulp-if');
var flatten = require('gulp-flatten');

gulp.task('fonts', function() {

    return gulp.src(config.fonts.src)
    .pipe(changed(config.fonts.dest))
    .pipe(flatten())
    .pipe(gulp.dest(config.fonts.dest));

});
