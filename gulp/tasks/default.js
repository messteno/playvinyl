'use strict';

var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', function(cb) {
    cb = cb || function() {};
    global.isProd = false;
    runSequence(['images', 'sass', 'css', 'browserify', 'fonts',
                 'html'], /* 'gettext-extract', 'gettext-compile', */ 'watch', cb);
});
