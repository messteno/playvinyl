'use strict';

var dotDir = function(dir) {
    return './' + dir;
};

var srcDir = 'frontend/src';
var buildDir = 'frontend/dist';
var bowerDir = 'bower_components';

module.exports = {
    'src': {
        'root': srcDir,
        'bower': bowerDir,
    },

    'dist': {
        'root': buildDir,
    },

    'scripts': {
        'src': srcDir + '/playvinyl/**/*.js',
        'dest': buildDir + '/js/',
    },

    'fonts': {
        'src': [
            srcDir + '/fonts/**/*',
            dotDir(bowerDir) + '/**/*.{eot,svg,ttf,woff,woff2}',
        ],
        'dest': buildDir + '/fonts/',
    },

    'html': {
        'src': srcDir + '/playvinyl/**/*.html',
        'dest': buildDir + '/html/',
    },

    'gzip': {
        'src': buildDir + '/**/*.{html,xml,json,css}',
        'dest': buildDir,
        'options': {}
    },

    'browserify': {
        'entries': [{
            'src': dotDir(srcDir) + '/playvinyl/playvinyl.js',
            'dest': 'playvinyl.js',
        }, {
            'src': dotDir(srcDir) + '/playvinyl/head.js',
            'dest': 'head.js',
        }],
        'sourcemap': true,
    },

    'images': {
        'src': [
            srcDir + '/img/**/*.{png,jpg,jpeg,ico,gif}',
        ],
        'dest': buildDir + '/img/',
    },

    'sass': {
        'entry': dotDir(srcDir) + '/playvinyl/playvinyl.scss',
        'src': srcDir + '/playvinyl/**/*.scss',
        'dest': buildDir + '/css/',
    },

    //'gettext': {
        //'src': [
            //srcDir + '/playvinyl/**/*.html',
        //],
        //'pot': {
            //'dst': srcDir + '/pot/',
            //'out': 'playvinyl.pot',
        //},
        //'po': {
            //'src': srcDir + '/po/**/*.po',
            //'dst': buildDir + '/languages/',
        //},
    //},

    'css': {
        'src': [
            dotDir(bowerDir) + '/owl-carousel2/dist/assets/owl.carousel.css',
            dotDir(bowerDir) + '/owl-carousel2/dist/assets/owl.theme.default.css',
        ],
        'out': 'vendor.css',
        'dest': buildDir + '/css/'
    },
};
