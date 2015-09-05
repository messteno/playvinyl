'use strict';

var config = require('../config');
var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');

gulp.task('lint', function() {
    return gulp.src(config.scripts.src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(notify(function (file) {
        if (file.jshint.success) {
            return false;
        }
        var errors = file.jshint.results.map(function (data) {
            if (data.error) {
                return '(' + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
            }
        }).join('\n');
        return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
    }));
});
