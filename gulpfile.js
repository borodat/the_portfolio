var     gulp         = require('gulp'),
        sass         = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        minifycss    = require('gulp-minify-css'),
        rename       = require('gulp-rename'),
        browserSync  = require('browser-sync').create(),
        concat       = require('gulp-concat'),
        uglify       = require('gulp-uglifyjs'),
        svgstore     = require('gulp-svgstore'),
        svgmin       = require('gulp-svgmin'),
        path         = require('path');

gulp.task('spritesvg', function () {
  return gulp.src('svg/svgs/*.svg')
  .pipe(svgmin())
  .pipe(svgstore())
  .pipe(rename("svgsprite.svg"))
  .pipe(gulp.dest('svg'))
  //.pipe(notify({ message: 'SVG sprite created' }));
});

gulp.task('browser-sync', ['styles', 'scripts'], function() {
        browserSync.init({
                open: false,
                server: {
                        baseDir: "./app"
                },
                notify: false
        });
});

gulp.task('styles', function () {
    return gulp.src('scss/*.scss')
    .pipe(sass({
        includePaths: require('node-bourbon').includePaths
    }).on('error', sass.logError))
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
    .pipe(minifycss())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return gulp.src([
        './app/libs/modernizr/modernizr.js',
        './app/libs/jquery/jquery-1.11.2.min.js',
        './app/libs/waypoints/waypoints.min.js',
        './app/libs/animatewithsass/animate-css.js',
        './app/libs/plugins-scroll/plugins-scroll.js',
        ])
        .pipe(concat('libs.js'))
        // .pipe(uglify()) //Minify libs.js
        .pipe(gulp.dest('./app/js/'));
});

gulp.task('watch', function () {
    gulp.watch('scss/*.scss', ['styles']);
    gulp.watch('app/libs/**/*.js', ['scripts']);
    gulp.watch('app/js/*.js').on("change", browserSync.reload);
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
