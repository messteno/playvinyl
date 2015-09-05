'use strict';

var config     = require('../config');
var gulp       = require('gulp');
var gettext = require('gulp-angular-gettext');

gulp.task('gettext-extract', function() {

    return gulp.src(config.gettext.src)
    .pipe(gettext.extract(config.gettext.pot.out, {}))
    .pipe(gulp.dest(config.gettext.pot.dst));

});

gulp.task('gettext-compile', function() {

    return gulp.src(config.gettext.po.src)
    .pipe(gettext.compile({
        format: 'json'
    }))
    .pipe(gulp.dest(config.gettext.po.dst));

});
