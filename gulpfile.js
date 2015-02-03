var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    browserifyShim = require('browserify-shim'),
    watchify = require('watchify'),
    ngAnnotate = require('gulp-ng-annotate'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefix = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    ignore = require('gulp-ignore'),
    notify = require('gulp-notify'),
    bower = require('gulp-bower'),
    filter = require('gulp-filter'),
    flatten = require('gulp-flatten'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    size = require('gulp-size'),
    mainBowerFiles = require('main-bower-files'),
    minifyCss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    eventStream = require('event-stream'),
    del = require('del'),
    streamify = require('gulp-streamify'),
    rename = require('gulp-rename'),
    prod = gutil.env.prod;

var config = {
    srcPath: 'frontend/src',
    srcDotPath: './frontend/src',
    tmpPath: './frontend/tmp',
    distPath: './frontend/dist',
    bowerDir: './bower_components',
};

gulp.task('sass', function() {
    return sass(config.srcDotPath + '/app/app.scss', {
            style: prod ? 'compressed' : 'nested',
            loadPath: [
                config.srcDotPath,
                config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
                config.bowerDir + '/fontawesome/scss',
                config.bowerDir + '/icomoon-sass/assets/scss',
            ],
            sourcemap: prod,
            precision: 2
        })
        .on("error", notify.onError(function (error) {
            return "Error: " + error.message;
        }))
        .pipe(autoprefix({
            browsers: ['last 2 version', 'ios 6', 'android 4']
        }))
        .pipe(gulp.dest(config.tmpPath + '/css/'));
});

gulp.task('css', ['sass'], function () {
    var bowerCss = gulp.src([
                config.bowerDir + '/owl-carousel2/dist/assets/owl.carousel.css',
                config.bowerDir + '/owl-carousel2/dist/assets/owl.theme.default.css',
            ])
            .pipe(filter('*.css'))
            .pipe(concat('vendor.css'));
            
    var appCss = gulp.src(config.tmpPath + '/css/*.css')
            .pipe(concat('app.css'));

    return eventStream.concat(bowerCss, appCss)
        .pipe(prod ? minifyCss() : gutil.noop())
        .pipe(concat(config.distPath + '/css/playvinyl.css'))
        .pipe(gulp.dest('./'));
});

gulp.task('lint', function () {
    return gulp.src(config.srcDotPath + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(notify(function (file) {
            if (file.jshint.success) {
                return false;
            }
            var errors = file.jshint.results.map(function (data) {
                if (data.error) {
                    return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
                }
            }).join("\n");
            return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
        }));
});

var watching = false;
gulp.task('enable-watch-mode', function() {
    watching = true;
});

gulp.task('js', ['lint'], function () {
    var bundler = browserify({
        entries: [
            config.srcDotPath + '/app/app.js'
        ],
        paths: ['./bower_components','./frontend/src/'],
        debug: !prod
    });

    if (watching) {
        bundler = watchify(bundler) 
    }

    bundler.on('update', function () {
        rebundle();
    })

    var rebundle = function () {
        bundler.transform(browserifyShim);
        var stream = bundler.bundle()
            .on('error', function(err){
                console.log(err.message);
                this.emit('end');
            });
        gutil.log('Starting \'' + gutil.colors.green('browserify') + '\'...');
        return stream
            .pipe(source('/app/app.js'))
            .pipe(streamify(ngAnnotate()))
            .pipe(streamify(prod ? uglify() : gutil.noop()))
            .pipe(streamify(size()))
            .pipe(rename('playvinyl.js'))
            .pipe(gulp.dest(config.distPath + '/js/'))
            .on('finish', function() {
                gutil.log('Finished \'' + gutil.colors.green('browserify') + '\'');
            });
    }

    return rebundle();
});

gulp.task('fonts:bower', function () {
    return gulp.src(mainBowerFiles())
        .pipe(filter('**/*.{eot,svg,ttf,woff}'))
        .pipe(flatten())
        .pipe(gulp.dest(config.distPath + '/fonts/'));
});

gulp.task('fonts:my', function () {
    return gulp.src(config.srcDotPath + '/fonts/**/*.{eot,svg,ttf,woff}')
        .pipe(gulp.dest(config.distPath + '/fonts/'));
});

gulp.task('fonts', ['fonts:bower', 'fonts:my']);

gulp.task('images', function () {
    return gulp.src(config.srcDotPath + '/img/**/*')
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(config.distPath + '/img/'));
});

gulp.task('html', function () {
    return gulp.src([
            config.srcDotPath + '/**/*.html'
        ])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(gulp.dest(config.distPath));
});

gulp.task('misc', function () {
    return gulp.src([
            config.srcDotPath + '/**/*.ico',
        ])
        .pipe(gulp.dest(config.distPath));
});

gulp.task('watch', ['enable-watch-mode', 'default'], function() {
    gulp.watch(config.srcPath + '/app/**/*.scss', ['css']);
    gulp.watch(config.srcPath + '/app/**/*.js', ['lint']);
    gulp.watch(config.srcPath + '/app/**/*.html', ['html']);
    gulp.watch(config.srcPath + '/**/*.ico', ['misc']);
    gulp.watch(config.srcPath + '/img/**/*.{png,jpg}', ['images']);
    gulp.watch(config.srcPath + '/fonts/**/*', ['fonts']);
});

gulp.task('test', [
    'lint',
]);

gulp.task('clean', function (done) {
    del([config.distPath, config.tmpPath], done);
});

gulp.task('default', [
    'css',
    'js',
    'fonts',
    'images',
    'html',
    'misc',
]);
