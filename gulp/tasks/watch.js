'use strict';

var config = require('../config');
var gulp   = require('gulp');
var watch  = require('gulp-watch');

gulp.task('watch', [], function() {

    watch(config.scripts.src, function() {
        gulp.start('lint');
    });
    watch(config.sass.src, function() {
        gulp.start('sass');
    });
    watch(config.fonts.src, function() {
        gulp.start('fonts');
    });
    watch(config.html.src, function() {
        gulp.start('html');
    });
    //watch(config.gettext.src, function() {
        //gulp.start('gettext-extract');
    //});
    watch(config.images.src, function() {
        gulp.start('images');
    });

});
