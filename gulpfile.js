//gulpfile.js
const gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass'),
    npmDist = require('gulp-npm-dist'),
    browserSync = require('browser-sync').create();

const sassFiles = 'scss/*.scss',
    cssDest = 'dist/css/';

//compile scss into css
function style() {
    return gulp.src(sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssDest))
        .pipe(browserSync.stream());
}

//minify css
function minifycss() {
    return gulp.src(['dist/css/*.css', '!dist/css/**/*.min.css'])
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(cssDest))
}


function minifyjs() {
    return gulp.src(['dist/js/**/*.js', '!dist/js/**/*.min.js'])
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
}


function copy() {
    gulp.src(npmDist(), {
            base: './node_modules'
        })
        .pipe(gulp.dest('./assets/libs'));
};

function watch() {
    browserSync.init({
        server: {
            baseDir: './',
            index: "/html/index.html",
            directory: true
        },
        startPath: '/html/index.html'
    })
    gulp.watch(['scss/**/*.scss'], style);
    gulp.watch(['dist/css/style.css'], minifycss);
    gulp.watch('html/*.html').on('change', browserSync.reload);
    gulp.watch(['dist/js/**/*.js', '!dist/js/**/*.min.js'], minifyjs);
}


gulp.task('default', watch);

exports.style = style;
exports.minifycss = minifycss;
exports.minifyjs = minifyjs;
exports.copy = copy;
exports.watch = watch;