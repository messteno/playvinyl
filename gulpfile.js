var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    ngAnnotate = require('gulp-ng-annotate'),
    browserifyShim = require('browserify-shim'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-ruby-sass'),
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
    mainBowerFiles = require('main-bower-files'),
    csso = require('gulp-csso'),
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
    return gulp.src(config.srcDotPath + '/app/app.scss')
        .pipe(
            sass({
                style: 'compressed',
                loadPath: [
                    config.srcDotPath,
                    config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
                    config.bowerDir + '/fontawesome/scss',
                ],
                'sourcemap=none': true,
                precision: 2
            })
            .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
            }))
        )
        .pipe(autoprefix())
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
        .pipe(csso())
        .pipe(concat(config.distPath + '/css/playvinyl.css'))
        .pipe(gulp.dest('./'));
});

gulp.task('lint', function () {
    return gulp.src(config.srcDotPath + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

var watching = false;
gulp.task('enable-watch-mode', function() {
    watching = true;
});

gulp.task('js', ['lint'], function () {
    var bundler = browserify({
        entries: [config.srcDotPath + '/app/app.js'],
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
        gutil.log('Started  \'browserify\'');
        return stream
            .pipe(source('/app/app.js'))
            .pipe(streamify(ngAnnotate()))
            .pipe(streamify(prod ? uglify() : gutil.noop()))
            .pipe(rename('playvinyl.js'))
            .pipe(gulp.dest(config.distPath + '/js/'))
            .on('finish', function() {
                gutil.log('Fnieshed \'browserify\'');
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
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(config.distPath + '/img/'));
});

gulp.task('misc', function () {
    return gulp.src([
            config.srcDotPath + '/**/*.ico',
            config.srcDotPath + '/**/*.html'
        ])
        .pipe(gulp.dest(config.distPath));
});

gulp.task('watch', ['enable-watch-mode', 'default'], function() {
    gulp.watch(config.srcPath + '/**/*.scss', ['css']);
    gulp.watch(config.srcPath + '/**/*.js', ['lint']);
    gulp.watch(config.srcPath + '/**/*.html', ['misc']);
    gulp.watch(config.srcPath + '/**/*.ico', ['misc']);
    gulp.watch(config.srcPath + '/img/**/*.{png,jpg}', ['images']);
    gulp.watch(config.srcPath + '/fonts/**/*', ['fonts']);
});

gulp.task('clean', function (done) {
    del([config.distPath, config.tmpPath], done);
});

gulp.task('default', [
    'css',
    'js',
    'fonts',
    'images',
    'misc',
]);
